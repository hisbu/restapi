const conn = require('../database')
const {uploader} = require('../helpers/uploader')
const fs = require('fs')

module.exports = {
    getPosts: (req, res)=>{
        var sql = `select * from post;`
        conn.query(sql, (err, result)=>{
            if(err) return res.status(500).send({message: 'Error!', error: err})

            return res.status(200).send(result)
        })
    },
    addPost: (req, res)=>{
        try {
            const path = '/post/images'; //file save path // memilih path untuk save file
            const upload = uploader(path, 'POS').fields([{ name: 'image'}]); //uploader(path, 'default prefix') // {name:'image'} > harus sama dengan properti yang ada di formData pada UI
    
            upload(req, res, (err) => {
                if(err){
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }
    
                const { image } = req.files;
                console.log(image)
                const imagePath = image ? path + '/' + image[0].filename : null;
                console.log(imagePath)
    
                console.log(req.body.data)
                const data = JSON.parse(req.body.data);
                console.log(data)
                data.image = imagePath;
                
                var sql = 'INSERT INTO post SET ?';
                conn.query(sql, data, (err, results) => {
                    if(err) {
                        console.log(err.message)
                        fs.unlinkSync('./public' + imagePath); //delete file from dir
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }

                    console.log(results);
                    sql = 'SELECT * from post;';
                    conn.query(sql, (err, results) => {
                        if(err) {
                            console.log(err.message);
                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                        }
                        console.log(results);
                        
                        return res.status(200).send(results);
                    })   
                })    
            })
        } catch(err) {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        }
    },
    deletePost: (req, res)=>{
        var postId = req.params.id
        var sql = `select * from post where id = ${postId};`;
        conn.query(sql, (err, results)=>{
            if(err){
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
            }

            if(results.length > 0){
                sql = `DELETE from post where id = ${postId};`
                conn.query(sql, (err1, results1)=>{
                    if(err1){
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message }); 
                    }

                    fs.unlinkSync('./public'+ results[0].image);
                    sql = `select * from post;`;
                    conn.query(sql, (err2, results2)=>{
                        if(err2){
                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                        }

                        res.send(results2);
                    })
                })
            }
        })
    },
    editPost: (req, res)=>{
        var postId = req.params.id
        var sql = `select * from post where id = ${postId};`;
        conn.query(sql, (err, results)=>{
            if(err){
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
            }
        })
    }
    
}