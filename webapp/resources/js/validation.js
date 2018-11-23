let form = document.getElementById("xyr_form");
let canvas = document.getElementById("grid");
let width = canvas.width;
let height = canvas.height;
let half_width = width / 2;
let half_height = height / 2;
let quarter_width = half_width / 2 - (width / 20);
let quarter_height = half_height / 2 - (height / 20);

const r = 45;
const extraValue = 0;

function canvasSubmit(event) {
    let rect = $("#canvas")[0].getBoundingClientRect();
    let paramR = $("input[name$='param-r']").val();
    let x = (event.clientX - rect.left - width / 2) / getCustomR() * paramR;
    let y = (height / 2 - (event.clientY - rect.top)) / getCustomR() * paramR;
    if (x < -4)
        x = -5; //magic value for validation failed
    if(x > 4)
        x = 5; //magic value for validation failed
    x = (Math.round(x*2)*1.)/2;
    $("input[name*='param-x']").val(x);
    $("input[name$='param-y']").val(y);
    formSubmit();
}

function getCustomR() {
    let result = $('input[name$="param-r"]').val().replace(",", ".") * r;
    if (isNaN(result) || result < r || result > r * 4)
        return r;
    else
        return result;
}

function drawPoints() {
    let canvas = document.getElementById("grid");
    alert(canvas);
    let ctx = canvas.getContext("2d");
    alert(ctx);
    let customR = 2;

   
    let allPointExist = true;

    let values = $("#result-table td").toArray();
    if (values.length > 3)
        for (let i = 0; i < values.length / 4; ++i) {
            allPointExist &= drawPoint(ctx,
                values[i * 4].innerText,
                values[i * 4 + 1].innerText,
                values[i * 4 + 2].innerText,
                !values[i * 4 + 3].innerText.includes("нет"));
        }

    if (!allPointExist)
        drawWarningMessage(ctx, "Не все точки будут отображены!", "#dc9100");

    // drawBase(ctx, customR);
    drawCanvas(canvas,customR);
}

function drawPoint(ctx, x, y, r, match, color) {
    if (color)
        ctx.fillStyle = color;
    else if (!match)
        ctx.fillStyle = "#FFAE00";
    else
        ctx.fillStyle = "#00D300";
    let customR = getCustomR();
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
        if(new FormData(form).get("R") !== "" ) {
            dotsArray.forEach(function (dot) {
                //alert(r + " aaaaaaaa");
                var pointer_x = (dot.x / r) * quarter_width * 2;
                var pointer_y = (dot.y / r) * quarter_height * 2;

                context.beginPath();
                context.arc(half_width + pointer_x, half_height - pointer_y, 1, 2 * Math.PI, 0);
                context.closePath();
                context.fill();
                context.stroke();
            });
        }
    }

}