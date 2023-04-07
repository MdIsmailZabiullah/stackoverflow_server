import express from 'express'

import {postAnsers,deleteAnswer}  from '../controllers/answer.js'
import auth from '../middlewares/auth.js'

const router= express.Router()

router.patch('/post/:id',auth, postAnsers)
router.patch('/delete/:id',auth, deleteAnswer)

export default router