const express = require('express')
const Write_modify = require('../schemas/write_modify')
const router = express.Router()
const multer = require('multer')


let storage  = multer.diskStorage({ //이미지 업로드 미들웨어    
	destination(req, file, cb) {
	  cb(null, 'uploadedFiles/');
	},
	filename(req, file, cb) {
	  cb(null, `${Date.now()}__${file.originalname}`);
	},
  });
  let upload = multer({ dest: 'uploadedFiles/' });
  let uploadWithOriginalFilename = multer({ storage: storage }); 


  //게시글작성
  router.post('/postadd', uploadWithOriginalFilename.single('image'),async(req,res)=>{ 
	console.log('연결')
	const image = req.file.filename
	const { title, content } = req.body
	
	console.log(title, content , image)
	let today = new Date();
	let createdAt = today.toLocaleString()
	let post_id = 0
	
	const Post_ls = await Board.find();		
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
	await Write_modify.create({ image, title, content, post_id, createdAt });
	
	
	res.redirect('/')
  });

//메이페이지 불러오기
router.get('/main', async (req, res) => {	

	const board = await Write_modify.find({});
	
	res.json({
		board
	});
});

//상세페이지 불러오기
router.get("/detail/:post_id", async (req, res) => {
	const { post_id } = req.params;	
	
	const [board] = await Write_modify.find({ post_id: Number(post_id) });
	
	// console.log(board)
	res.json({
		board
	});
});


module.exports = router