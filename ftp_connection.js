const fs = require('fs')
const path = require('path')
let Client = require('ssh2-sftp-client');

exports.uploadFile = async (remote,origin,directory,file_name) =>{    
    console.log('Entered File Upload FUnction');    
    var to_check = file_name.split('.').pop();
    console.log(to_check);    
    if (remote.type_file_to_save != undefined) {
        if (remote.type_file_to_save[to_check]) {        
            return await new Promise((resolve,reject)=>{
                console.log('Uploading File');
                let data = fs.createReadStream(directory+'/'+file_name)    
                let sftp = new Client(); 
                sftp.connect({
                    host: remote.host,
                    port: remote.port,
                    username: remote.username,
                    password: remote.password
                }).then(async () => {
                    console.log('Uploading new file');        
                    const new_directory = path.join(directory,file_name).replace(path.normalize(origin),remote.directory)                            
                    const path_directory_file = path.normalize(new_directory).replace(/\\/gim,'/')            
                    await sftp.put(data, path_directory_file ,{chunkSize: 32768});
                })
                .then(async () => {
                    console.log(`Fichier ajouté => ${file_name}`);    
                    data.close()    
                    await sftp.end();
                    resolve()
                })
                .catch(err => {
                    console.error(err.message);
                    reject()
                });
            })
        }
    }else{
        return await new Promise((resolve,reject)=>{
            console.log('Uploading File');
            let data = fs.createReadStream(directory+'/'+file_name)    
            let sftp = new Client(); 
            sftp.connect({
                host: remote.host,
                port: remote.port,
                username: remote.username,
                password: remote.password
            }).then(async () => {
                console.log('Uploading new file');        
                const new_directory = path.join(directory,file_name).replace(path.normalize(origin),remote.directory)                            
                const path_directory_file = path.normalize(new_directory).replace(/\\/gim,'/')            
                await sftp.put(data, path_directory_file ,{chunkSize: 32768});
            })
            .then(async () => {
                console.log(`Fichier ajouté => ${file_name}`);    
                data.close()    
                await sftp.end();
                resolve()
            })
            .catch(err => {
                console.error(err.message);
                reject()
            });
        })
    }
}

exports.createAFolder = async (remote,origin,directory_path,folder_name) =>{  
    console.log('Entered Folder Creation FUnction');    
    return await new Promise((resolve,reject)=>{
        let sftp = new Client(); 
        sftp.connect({
            host: remote.host,
            port: remote.port,
            username: remote.username,
            password: remote.password
        }).then(async () => {             
            const new_directory = (path.join(directory_path,folder_name).replace(path.normalize(origin),remote.directory)).replace(/\\/gim,'/')
            await sftp.mkdir(new_directory, true);
          })
          .then(() => {
            console.log('Folder Created');    
            resolve(sftp.end())
          })
          .catch(err => {
              console.error(err.message);
              reject('error')
          });
    })
}

exports.listDir = async (remote)=>{
    return await new Promise((resolve,reject)=>{
        let sftp = new Client(); 
        sftp.connect({
            host: remote.host,
            port: remote.port,
            username: remote.username,
            password: remote.password
        }).then(() => {
            return sftp.list('/home/pi/sync');
          }).then(data => {
            resolve(data)
          }).catch(err => {
            console.log(err, 'catch error');
            reject(err)
          });
    })
}