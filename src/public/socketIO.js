const socket = io()

$('#paridade').ready(function () { // solicita os dados ao servidor
    const email = $("#email").val()
    const password = $("#password").val()
    socket.emit('paridade', {
        email: email,
        password: password
    })
    console.log('solicitando os dados ao servidor')
})
socket.on('paridade', function (data) { // escuta o evento enviado pelo servidor
    var html = ''

    for (var i = 0; i < data.length; i++) {
        if (i == 0) {
            continue 
        }
        html += '<option value="data[i]">' + data[i] + '</option>'
    }
    $('#paridade').html(html)
})

$('#acertividade').ready(function () { // solicita os dados ao servidor
    const email = $("#email").val()
    const password = $("#password").val()
    socket.emit('acertividade_mhi', {
        email: email,
        password: password
    })
    console.log('solicitando os dados ao servidor')
})
socket.on('acertividade_mhi', function (data) { // escuta o evento enviado pelo servidor
    var html = ''
    var col = 0
    for (var i = 0; i < data.length; i++) {

        if (i == 0) {
            continue
        }
       
            col++
            if (col == 1) {
                html += '<tr>'
                html += '<td style="font-size: 7pt;">' + data[i] + '</td>'
            }
            if (col == 2) {
                if (data[i] <= 80) {
                    html += '<td class="text-danger" style="font-size: 8pt;">' + data[i] + '%</td>'
                    html += '</tr>'
                    
                } else if (data[i] <= 90 && data[i] > 80) {
                    html += '<td class="text-warning" style="font-size: 8pt;">' + data[i] + '%</td>'
                    html += '</tr>'
                    
                } else if (data[i] < 100 && data[i] > 90) {
                    html += '<td class="text-success" style="font-size: 8pt;">' + data[i] + '%</td>'
                    html += '</tr>'
                    
                }
                if(data.length-2 != i){
                    col = 0
                }
            }
    }
    
    html += '<tr><td colspan = 2 style="font-size: 6pt;">' + data[data.length-1] + '</td></tr>'
   
    $('#acertividade').html(html)
})