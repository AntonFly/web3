let form = document.getElementById("xyr_form");
let canvas = document.getElementById("grid");
alert(canvas);
let grid =$("#grid");
let width = canvas.width;
let height = canvas.height;
let half_width = width / 2;
let half_height = height / 2;
let quarter_width = half_width / 2 - (width / 20);
let quarter_height = half_height / 2 - (height / 20);
let r= 3;
let x= 3;
let dotsArray=[];
const extraValue = 0;
function changeX(X){
    x=X;
    alert(x);
    form.appendData("X",x);

}
function changeR(R) {
         r= R;
         alert(r);
         form.appendData("R",r);
        drawPoints();
}

function canvasSubmit(event) {
    let padding=parseInt(grid.css("padding"))+parseInt(grid.css("border"));
    let width = canvas.width;
    let height = canvas.height;

        let posX=event.pageX-getOffsetRect(canvas).left;
        let posY =event.pageY-getOffsetRect(canvas).top;
        let deltaX=canvas.width/2+padding;
        let deltaY=canvas.height/2+padding;
        let coorX = ((posX - deltaX) / (2*quarter_width/r) ).toFixed(3);
        let coorY = ((-posY + deltaY) / (2*quarter_height/r) ).toFixed(3);
        // alert(canvas.width+" "+ deltaX+" "+"\n"+canvas.height +"\nposX "+posX+"\nposY "+posY+"\nX "+coorX+"\nY "+coorY);
        let formData = new FormData;
        formData.append("X", coorX);
        formData.append("Y", coorY);
        formData.append("R", r);
    formSubmit();
}



function drawPoints() {
    dotsArray = $("#result_table td").toArray();
    drawCanvas(canvas,r);
}

function drawPointSHILKO(ctx, x, y, r, match, color) {
    if (color)
        ctx.fillStyle = color;
    else if (!match)
        ctx.fillStyle = "#FFAE00";
    else
        ctx.fillStyle = "#00D300";
    let customR = r;
    let pointX = x * customR / r + width / 2;
    let pointY = -y * customR / r + height / 2;
    if (pointX < 0 || pointY < 0 || pointX > width || pointY > height)
        return false;
    else {
        ctx.beginPath();
        ctx.arc(pointX, pointY, 2, 0, Math.PI * 2, false);
        ctx.stroke();
        ctx.fill();
    }
    return true;
}

function drawWarningMessage(ctx, message, color) {
    ctx.fillStyle = color;
    ctx.font = "10px Arial";
    ctx.fillText(message, 0, height);
}



$(() => {
    drawPoints();
    setListeners();
});

function setListeners() {
    $(document).on("mouseover", "#result-table tr", (event) => {
        let values = $(event.currentTarget).find("td").toArray();
        if (values.length < 4)
            return;
        event.currentTarget.style.backgroundColor = "#5FB0CF"; //#5FC0CE - #FFF
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext("2d");
        if (!drawPoint(ctx,
            values[0].innerText,
            values[1].innerText,
            values[2].innerText,
            !values[3].innerText.includes("нет"),
            "red"))
            drawWarningMessage(ctx, "Не все точки будут отображены!", "red");
    });
    $(document).on("mouseout", "#result-table tr", (event) => {
        event.currentTarget.style.backgroundColor = null;
        drawPoints();
    });
    $(document).on("click", "#result-table thead", (event) => {
        sort(event);
    });
    $(document).on("change paste keyup", "input[name$='param-r']", (event) => {
        drawPoints();
    });
}
function drawCanvas(canvas, r) {
    if (canvas.getContext) {
        var someR;
        var someRh;
        var msomeR;
        var msomeRh;

        if(new FormData(form).get("R") !== "" ) {
            someR = r;
            someRh = r/2;
            msomeR = -r;
            msomeRh = -r/2
        }
        else {someR = "-";
            someRh = "-";
            msomeR = "-";
            msomeRh = "-";
        }

        var context = canvas.getContext("2d");

        context.clearRect(0, 0, width, height);


        context.strokeStyle = "black";
        context.fillStyle = "black";

        //Create grid
        {
            context.beginPath();
            context.font = "10px sans-serif";
            context.moveTo(0, half_height);
            context.lineTo(width, half_height);
            context.lineTo(width - 8, half_height + 3);
            context.lineTo(width - 8, half_height - 3);
            context.lineTo(width, half_height);
            context.fillText("X", width - 8, half_height - 7);

            context.moveTo(half_width, 0);
            context.lineTo((half_width) - 3, 8);
            context.lineTo((half_width) + 3, 8);
            context.lineTo(half_width, 0);
            context.lineTo(half_width, height);
            context.fillText("Y", half_width + 5, 10);


            context.moveTo(half_width - 2 * quarter_width, half_height - 4);
            context.lineTo(half_width - 2 * quarter_width, half_height + 4);
            context.fillText(msomeR, half_width - 2 * quarter_width - 5, half_height - 6);

            context.moveTo(half_width - 1 * quarter_width, half_height - 4);
            context.lineTo(half_width - 1 * quarter_width, half_height + 4);
            context.fillText(msomeRh, half_width - 1 * quarter_width - 8, half_height - 6);

            context.moveTo(half_width + 2 * quarter_width, half_height - 4);
            context.lineTo(half_width + 2 * quarter_width, half_height + 4);
            context.fillText(someR, half_width + 2 * quarter_width - 3, half_height - 6);

            context.moveTo(half_width + 1 * quarter_width, half_height - 4);
            context.lineTo(half_width + 1 * quarter_width, half_height + 4);
            context.fillText(someRh, half_width + 1 * quarter_width - 5, half_height - 6);


            context.moveTo(half_width - 4, half_height - (2 * quarter_height));
            context.lineTo(half_width + 4, half_height - (2 * quarter_height));
            context.fillText(someR, half_width + 5, half_height - 2 * quarter_height + 4);

            context.moveTo(half_width - 4, half_height - (1 * quarter_height));
            context.lineTo(half_width + 4, half_height - (1 * quarter_height));
            context.fillText(someRh, half_width + 5, half_height - 1 * quarter_height + 4);

            context.moveTo(half_width - 4, half_height + (2 * quarter_height));
            context.lineTo(half_width + 4, half_height + (2 * quarter_height));
            context.fillText(msomeR, half_width + 5, half_height + 2 * quarter_height + 4);

            context.moveTo(half_width - 4, half_height + (1 * quarter_height));
            context.lineTo(half_width + 4, half_height + (1 * quarter_height));
            context.fillText(msomeRh, half_width + 5, half_height + 1 * quarter_height + 4);

            context.closePath();
            context.strokeStyle = "black";
            context.fillStyle = "black";
            context.stroke();
            context.fill();
        }

        //Create figure
        {
            context.beginPath();
            context.moveTo(half_width, half_height);
            context.ellipse(half_width, half_height, 2*quarter_width, 2*quarter_height, 3.14159, 0, Math.PI  / 2, false);
            context.rect(half_width, half_height-quarter_height, 2*quarter_width, quarter_height);

            context.moveTo(half_width, half_height);
            context.lineTo(half_width, half_height + 2*quarter_height);
            context.lineTo(half_width + quarter_width, half_height);
            context.lineTo(half_width, half_height);

            context.closePath();
            context.fillStyle = 'rgba(0, 97, 255, 0.7)';
            context.fill();
        }
        context.strokeStyle = "orange";
        context.fillStyle = "orange";

        //Create point of answer
        for (let i = 0; i < dotsArray.length / 4; ++i){
            let x=dotsArray[i*4].innerText;

            let y=dotsArray[i*4+1].innerText;
            // let r=dotsArray[i*4+2].innerText;
            let res=dotsArray[i*4+3].innerText;

            if (res=="false")
                context.fillStyle = "#FFAE00";
            else
                context.fillStyle = "#00D300";
                let pointer_x = (x / r) * quarter_width * 2;
                let pointer_y = (y / r) * quarter_height * 2;

                context.beginPath();
                context.arc(half_width + pointer_x, half_height - pointer_y, 2, 2 * Math.PI, 0);
                context.closePath();
                context.fill();
                context.stroke();
            }
        }

}
 function drawPoint(context,x,y,r,res,color){
            var pointer_x = (x / r) * quarter_width * 2;
             var pointer_y = (y / r) * quarter_height * 2;
            if (!res)
                context.fillStyle = "#FFAE00";
            else
                context.fillStyle = "#00D300";
             context.beginPath();
             context.arc(half_width + pointer_x, half_height - pointer_y, 1, 2 * Math.PI, 0);
             context.closePath();
             context.fill();

}