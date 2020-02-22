const Express=require("express");
const ExpressGraphQL=require("express-graphql");
const Mongoose=require("mongoose");//You have to declare it to start mongooose
const{
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLNonNull
}=require("graphql");
var app=Express();
Mongoose.connect("mongodb://localhost/developerapi");

//Data model of person
const PersonModel=Mongoose.model("person",{
    lastname:String,
    fisrtname:String
});
//GraphQL object of person data model
const PersonType=new GraphQLObjectType({
    name:"Person",
    fields:{
        id:{type:GraphQLID},
        firstname:{type:GraphQLString},
        lastname:{type:GraphQLString}
    }
});
//Schema with collection of data model and grphql object
const schema=new GraphQLSchema({
    query:new GraphQLObjectType({
        name:"Query",
        fields:{
            people:{
                type:GraphQLList(PersonType),
                resolve:(root,args,context,info)=>{
                    return PersonModel.find().exec();
                }
            },
            person:{
                type:PersonType,
                args:{
                   id:{type:GraphQLNonNull(GraphQLID)}
                },
                resolve:(root,args,context,info)=>{
                    return PersonModel.findById(args.id).exec();
                }
            }
        }
    }),
    mutation: new GraphQLObjectType({
        name: "Mutation",
        fields: {
            person: {
                type: PersonType,
                args: {
                    firstname: { type: GraphQLNonNull(GraphQLString) },
                    lastname: { type: GraphQLNonNull(GraphQLString) }
                },
                resolve: (root, args, context, info) => {
                    var person = new PersonModel(args);
                    return person.save();
                }
            }
        }
    })
});
app.use("/graphql",ExpressGraphQL({
    schema:schema,
    graphiql:true
}))
app.listen(3000,()=>{
    console.log("Listening at :3000...");
});