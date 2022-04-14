const express = require('express')
const Write_modify = require('../schemas/write_modify')
const router = express.Router()
const authMiddleware = require("../routers/auth-middleware")

const path = require("path");
let AWS = require("aws-sdk");
AWS.config.loadFromPath(path.join(__dirname, "../config/s3.json")); // 인증
let s3 = new AWS.S3();

let multer = require("multer");
let multerS3 = require('multer-s3');
let upload = multer({

    storage: multerS3({
        s3: s3,
        bucket: "sparta-bucket-jw",
        key: function (req, file, cb) {
             let extension = path.extname(file.originalname);
             cb(null, Date.now().toString() + extension)
        },
        acl: 'public-read-write',
    })
})
//게시글작성
router.post('/user/postadd',authMiddleware, upload.single('image'), async (req, res) => {
    try {
        console.log("req.file: ", req.file); // 테스트 => req.file.location에 이미지 링크(s3-server)가 담겨있음 
		const { title, content } = req.body
		const image = req.file.location
		const {id} = res.locals.user
		console.log(id)
	console.log(title, content,image)
	let today = new Date();
	let createdAt = today.toLocaleString()
	let post_id = 0
	
	const Post_ls = await Write_modify.find();		
	if(Post_ls.length){
		post_id = Post_ls[Post_ls.length-1]['post_id'] + 1
	}else{
		post_id = 1
	}
	if( !title || !image || !content ){
		return res.status(400).json({
			errorMessage: "빈칸 없이 모두 입력해주세요"		
		});	
	}	
	await Write_modify.create({ image, title, content, post_id, createdAt, id  });
	res.json({id})
    } catch (err) {
        console.log(err);
        response(res, 500, "서버 에러")
    }
});




//메인페이지 불러오기
router.get('/user/main', async (req, res) => {	

	const board = await Write_modify.find({}).sort({"post_id": -1});
	// console.log(board)
	res.json({
		board
	});
});

//상세페이지 불러오기
router.get("/user/detail/:post_id", async (req, res) => {
	const { post_id } = req.params;	
	
	const [board] = await Write_modify.find({ post_id: Number(post_id) });
	
	// console.log(board)
	res.json({
		board
	});
});

//게시글 삭제
router.delete("/user/delete/:post_id",authMiddleware, async(req, res) =>{
	const { post_id } = req.params
	console.log(post_id)
	const {user} = res.locals;
	const video = await Write_modify.find({post_id: Number(post_id)})  // 현재 URL에 전달된 id값을 받아서 db찾음
	
	const url = video[0].image.split('/')    // video에 저장된 fileUrl을 가져옴

	const delFileName = url[url.length - 1]

	await Write_modify.deleteOne({post_id: Number(post_id)});
	s3.deleteObject({
			Bucket: 'sparta-bucket-jw',
			Key: delFileName
	}, (err, data) => {
			if (err) { throw err; }
	});
	res.json({success: "삭제가 완료되었습니다!"});
});


//게시글 수정
router.post("/user/postmodify/:post_id",authMiddleware,upload.single('image'), async (req, res)=>{
	const { post_id } = req.params
	const { title, content } = req.body
	const image = req.file.location
	const {user} = res.locals;

	const video = await Write_modify.find({post_id: Number(post_id)})  // 현재 URL에 전달된 id값을 받아서 db찾음	
	const url = video[0].image.split('/')    // video에 저장된 fileUrl을 가져옴
	const delFileName = url[url.length - 1]
		s3.deleteObject({
		Bucket: 'sparta-bucket-jw',
		Key: delFileName
		}, (err, data) => {
			if (err) { throw err; }
		});
	
	await Write_modify.updateOne({post_id: Number(post_id)}, { $set: {title, content, image }}) 	
	
	
	 res.json({success: "수정이 완료되었습니다!"})
})

module.exports = router