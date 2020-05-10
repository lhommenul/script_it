const path = require('path')
const fs = require('fs')
const {uploadFile , createAFolder , listDir} = require('./ftp_connection')
const express = require('express')
const app = express();

const START_DIRECTORY = 'C:/Users/TDtwi/'
const START_FOLDER = 'Pictures'

const REMOTE = {
    directory: '/home/pi/ftp/',
    host: '192.168.1.65',
    port: '22',
    username: 'pi',
    password: 'raspberry',
    // type_file_to_save:{
    //     txt:true
    // },
}

app.get('/allimg',async (req,res)=>{
    res.send(await name())
})
        async function name() {
            return await listDir(REMOTE);
        }

// console.log(listDir(REMOTE));

exports.ScanSync = (START_DIRECTORY,START_FOLDER,REMOTE)=>{
    class Folder{
        constructor(directory_path,file_name,children){
            this.directory_path = directory_path
            this.file_name = file_name
            this.children = children   
        }
        async generateFolder(){
            return await createAFolder(REMOTE,START_DIRECTORY,this.directory_path,this.file_name)        
        }
    }
    class File{
        constructor(directory_path,file_name){
            this.directory_path = directory_path
            this.file_name = file_name
        }
        async generateFile(){
            return await uploadFile(REMOTE,START_DIRECTORY,this.directory_path,this.file_name)
        }
    }
    class Unknow{
        constructor(directory_path,file_name){
            this.directory_path = directory_path
            this.file_name = file_name
        }
    }
    (async function start() {
        // Starting Point => Create a folder()
        var starting_folder = new Folder(START_DIRECTORY,START_FOLDER,[])
        // Generate the folder into the server
        await starting_folder.generateFolder()
        // List all the files/folders
        readSubDirectory(starting_folder)
    })()
    // List all the files/folders contained into the directory
    async function readSubDirectory(folder){
        console.log('1 : Searching sub/folder');
        // Read all children Files/Folders
        fs.readdir(folder.directory_path+folder.file_name,async (err,files)=>{              
            if (err == null) {
                console.log('2 : Listing all the files/folders');            
                fileOrFolder(folder,files)
            } else {
                console.error('2 : Error while tryingto list all files/folders')
            }    
        })
        // Generate folders/files
        function fileOrFolder(parent,files) {
            console.log('=== File of Folder ===');        
            // children element of the parent directory
            var container = [];
            // Determine eatch type document  => Folder/File        
            for (let index = 0; index < files.length; index++) {
                console.log('= Loop =');
                container.push(selector(parent,files[index]))
            }
            async function selector(parent,file) {            
                console.log('=== FILE OR FOLDER ===');
                var file_path = parent.directory_path+parent.file_name+'/'+file;
                await fs.lstat(file_path,async (err,directory)=>{
                    if (directory.isDirectory()) {
                        // Creating a new Folder
                        console.log('FOLDER');                    
                        var new_folder = new Folder(parent.directory_path+parent.file_name+'/',file,[])
                        await new_folder.generateFolder()                    
                        readSubDirectory(new_folder)
                    }else if(directory.isFile()){                 
                        // Creating a new File
                        console.log('FILE');
                        var new_file = new File(parent.directory_path+parent.file_name+'/',file)
                        await new_file.generateFile()                    
                    }else{
                        console.error('File type unknow')
                    }            
                });
            }
        }
    }
}


app.listen(8080)
