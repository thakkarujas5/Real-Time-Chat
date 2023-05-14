const io = require('socket.io')(3001)

let users = [];


function findUser(id) {

    for(let i=0;i<users.length;i++)
    {
        if(users[i].id===id) return users[i]
    }
}

function addUser(user) {
    users.push(user)
}

function removeUserById(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users.splice(index, 1);
    }
}

io.on('connection', socket => {
    socket.on('join',({user,room}) => {
  
      const userTemp = {
        id: socket.id,
        username: user,
        room:room
      }

      addUser(userTemp)

      console.log(users)

      socket.join(room);
      socket.broadcast.to(room).emit('user-connected',user)
    })


    socket.on('send-chat-message',message => {
  
      const user = findUser(socket.id);
      socket.broadcast.to(user.room).emit('chat-message',{ message: message, name: user.username})
    })
  
    socket.on('disconnect', () => {
  
      const user = findUser(socket.id);
      socket.broadcast.to(user.room).emit('user-disconnected', user.username)
      removeUserById(socket.id)
    })
  })
