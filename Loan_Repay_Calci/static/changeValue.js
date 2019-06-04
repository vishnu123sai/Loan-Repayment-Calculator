
$(document).ready(function(){
    $('form.ranging').on('click', function(){
            var temp_r = $('form input').val();
            document.getElementById('myRange').value = temp_r;
            console.log(temp_r)
            $.ajax({
                type:"POST",
                url: "/",
                temp_r : temp_r,
                success: function(temp_r){
                    location.reload()
                }
                

            });
            
    });
});