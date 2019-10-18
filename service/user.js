const BLOGDB = require('../database.js');

// 登陆
const login = (req, res) => {
	const { username = '', password = '' } = req.query;
	// 定义SQL语句
	// const sqlStr = `SELECT a.id, a.title, a.introduction, a.banner, a.create_time createTime, a.read_count readCount, a.like_count likeCount, msgCount, type FROM artical a LEFT JOIN ( SELECT count(*) msgCount, m.artical_id FROM artical_message m GROUP BY artical_id ) t ON a.id = t.artical_id LEFT JOIN ( SELECT ty.name type, ty.artical_id FROM artical_type ty ) t2 ON a.id = t2.artical_id LIMIT ${(pageNum - 1) * pageSize}, ${pageNum * pageSize}; SELECT count(*) total FROM artical;`;
	const sqlStr = `SELECT * FROM user WHERE name = '${username}'`;
	BLOGDB.query(sqlStr, (err, results) => {
		console.log('errormsg: ', err, 'results:', results);
		if(err) return res.json({code: -1, message: '获取失败'})
		const response = results[0];
		if (!response) {
			console.log('login: ', 'error username');
			res.json({
				code: -1,
				message: 'error username',
			})
		} else if (response.password === password) {
			console.log('login: ', 'success');
			res.json({
				code: 0,
				message: 'success',
				data: {
					name: response.username,
					email: response.email,
					leaveTime: response.leave_time,
				},
			})
		} else {
			console.log('login: ', 'error password');
			res.json({
				code: -1,
				message: 'error password',
			})
		}
	})
}

// 插入文章
const insertArtical = (req, res) => {
	const { title = null, introduction = '文章简介', banner = null, mainContent = null, createTime = null, readCount = 0 } = req.body;
	const sqlStr = `INSERT INTO artical (title, introduction, banner, main_content, create_time, read_count) VALUES (?, ?, ?, ?, ?, ?);`
	BLOGDB.query(sqlStr, [title, introduction, banner, mainContent, createTime, readCount], (err, results) => {
		console.log('errormsg: ', err, 'results:', results);
		if(err) return res.json({code: -1, message: '获取失败'});
		res.json({
			code: 0,
			message: 'success',
		})
	})
}

// 根据id查找文章
const selectArtical = (req, res) => {
	const { id } = req.query;
	const sqlStr = `SELECT id, title, introduction, banner, DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") createTime, read_count readCount, like_count likeCount, main_content mainContent FROM artical WHERE id = ${id};`
	BLOGDB.query(sqlStr, (err, results) => {
		console.log('errormsg: ', err, 'results:', results);
		if(err) return res.json({code: -1, message: '获取失败'});
		const resData = results[0] || {}
		res.json({
			code: 0,
			message: 'success',
			data: resData,
		})
	})
}

module.exports = {
	login,
	insertArtical,
	selectArtical,
}

