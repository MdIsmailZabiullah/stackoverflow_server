import mongoose from "mongoose"
import Question from '../models/Questions.js'

export const getAllquestions= async (req, res) => {
    try {
        const questionList= await Question.find();
        res.status(200).json(questionList)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}
export const AskQuestion= async (req, res) => {
    const postQuestionData= req.body;
    const postQuestion= new Question(postQuestionData);
    try{
        await postQuestion.save();
        res.status(200).json("posted a question successfully")
    }catch(error){
        console.log(error)
        res.status(200).json("coudn't post a new question ")
    }
}

export const deleteQuestion = async (req,res) => {
    const {id: _id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send('question unavailable')
    }
    try {
        await Question.findByIdAndRemove(_id);
        res.status(200).json({message: "succesfully deleted"})
    } catch (error) 
        {
        res.status(404).json({message: error.message})
     }
}
export const voteQuestion= async(req,res) =>{
    const {id:_id}= req.params;
    const {value,userId}= req.body;
    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send('question unavailable')
    }
    try {
        const question= await Question.findById(_id)
        const upIndex= question.upVote.findIndex((id)=> id === String(userId))
        const downIndex= question.downVote.findIndex((id)=> id === String(userId))
        if (value === 'upvote'){
            if(downIndex !== -1){
                question.downVote= question.downVote.filter((id) => id!== String(userId))
            }
            if(upIndex === -1){
                question.upVote.push(userId)
            }else{
                question.upVote = question.upVote.filter((id) => id !== String(userId))
            }
        } else if (value === 'downvote'){
            if(upIndex !== -1){
                question.upVote= question.upVote.filter((id) => id!== String(userId))
            }
            if(downIndex === -1){
                question.downVote.push(userId)
            }else{
                question.downVote = question.downVote.filter((id) => id !== String(userId))
            }
        }
        await Question.findByIdAndUpdate(_id,question)
        res.status(200).json({message: "voted successfully...."})
    } catch (error) {
        res.status(404).json({message: "id notb found...."})
    }
}

