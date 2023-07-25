// 获取相关元素
let lineA = document.getElementById("arrow-lineA");
let lineB = document.getElementById("arrow-lineB");
let lineC = document.getElementById("arrow-lineC");
let A = document.getElementById("A");
let B = document.getElementById("B");
let C = document.getElementById("C");
let Acir = document.getElementById("markerA");
let Bcir = document.getElementById("Bcir");
let Ccir = document.getElementById("Ccir");
let svgContainer = document.getElementById("svg-container");

// 定义全局变量
let isDragging = false;

// 鼠标按下事件处理程序
lineA.addEventListener("mousedown", startDragA);
Acir.addEventListener("mousedown", startDragAA);
lineA.addEventListener("touchstart", startDragA);
Acir.addEventListener("touchstart", startDragA);
lineB.addEventListener("mousedown", startDragB);
Bcir.addEventListener("mousedown", startDragB);
lineB.addEventListener("touchstart", startDragB);
Bcir.addEventListener("touchstart", startDragB);
lineC.addEventListener("mousedown", startDragC);
Ccir.addEventListener("mousedown", startDragC);
lineC.addEventListener("touchstart", startDragC);
Ccir.addEventListener("touchstart", startDragC);

console.log("ok")
function startDragAA(event) {
    // console.log("Acir is moving")
    isDragging = true;
    // 鼠标移动事件处理程序
    svgContainer.addEventListener("mousemove", dragA);
    svgContainer.addEventListener("touchmove", dragA_mobile);
    // 鼠标释放事件处理程序
    svgContainer.addEventListener("mouseup", stopDragA);
    svgContainer.addEventListener("touchend", stopDragA_mobile);
}
/*********************************************
 *
 * A监听
 */
// 开始拖动
function startDragA(event) {
    console.log("Aline is moving")
    isDragging = true;
    // 鼠标移动事件处理程序
    svgContainer.addEventListener("mousemove", dragA);
    svgContainer.addEventListener("touchmove", dragA_mobile);
    // 鼠标释放事件处理程序
    svgContainer.addEventListener("mouseup", stopDragA);
    svgContainer.addEventListener("touchend", stopDragA_mobile);
}
// 拖动过程中更新线的位置
function dragA(event) {
    if (isDragging) {
        let svgRect = svgContainer.getBoundingClientRect();
        let lineX = event.clientX - svgRect.left;
        let lineY = event.clientY - svgRect.top;
        lineA.setAttribute("x2", lineX);
        lineA.setAttribute("y2", lineY);

        // 更新文字位置
        let centerX = 125, centerY = 125;
        if (lineX <= centerX && lineY <= centerY) {
            A.setAttribute('x', lineX - 15);
            A.setAttribute('y', lineY - 15);
        } else if (lineX <= centerX && lineY >= centerY) {
            A.setAttribute('x', lineX - 15);
            A.setAttribute('y', lineY + 15);
        } else if (lineX >= centerX && lineY >= centerY) {
            A.setAttribute('x', lineX + 15);
            A.setAttribute('y', lineY + 15);
        } else if (lineX >= centerX && lineY <= centerY) {
            A.setAttribute('x', lineX + 10);
            A.setAttribute('y', lineY - 10);
        }
    }
}
function dragA_mobile(event) {
    if (isDragging) {
        let svgRect = svgContainer.getBoundingClientRect();
        let lineX = event.touches[0].clientX - svgRect.left;
        let lineY = event.touches[0].clientY - svgRect.top;
        // console.log(svgRect + " " + event.touches[0].clientX + ", " + event.touches[0].clientY)
        lineA.setAttribute("x2", lineX);
        lineA.setAttribute("y2", lineY);
        // console.log("moveA --> " + lineX + " " + lineY)

        // 更新文字位置
        let centerX = 125, centerY = 125;
        if (lineX <= centerX && lineY <= centerY) {
            A.setAttribute('x', lineX - 15);
            A.setAttribute('y', lineY - 15);
        } else if (lineX <= centerX && lineY >= centerY) {
            A.setAttribute('x', lineX - 15);
            A.setAttribute('y', lineY + 15);
        } else if (lineX >= centerX && lineY >= centerY) {
            A.setAttribute('x', lineX + 15);
            A.setAttribute('y', lineY + 15);
        } else if (lineX >= centerX && lineY <= centerY) {
            A.setAttribute('x', lineX + 10);
            A.setAttribute('y', lineY - 10);
        }
    }
}

// 拖动结束时延伸线到离线终点外最近的圆的边上
function stopDragA(event) {
    isDragging = false;
    var lineEndX = parseFloat(lineA.getAttribute("x2"));
    var lineEndY = parseFloat(lineA.getAttribute("y2"));
    // console.log(lineEndX, " ", lineEndY)
    var circles = document.querySelectorAll("circle[id^='drawing-area']");
    var closestCircle;
    var minDistance = Number.MAX_VALUE;

    // 寻找离线终点最近的圆
    let flag = 0, MaxCircle, pre_r = 0;
    circles.forEach(function (circle) {
        var circleX = parseFloat(circle.getAttribute("cx"));
        var circleY = parseFloat(circle.getAttribute("cy"));
        var radius = parseFloat(circle.getAttribute("r"));
        var distance = Math.sqrt(Math.pow(lineEndX - circleX, 2) + Math.pow(lineEndY - circleY, 2));
        if (distance <= minDistance && distance < radius) {
            // console.log(circleX + " " + circleY + " " + radius + " " + distance)
            minDistance = distance;
            closestCircle = circle;
            flag = 1
        }
        if (pre_r < radius) {
            MaxCircle = circle
            pre_r = radius
        }
    });
    if (flag === 0) closestCircle = MaxCircle

    // 更新线的终点为交点坐标
    if (closestCircle) {
        var circleX = parseFloat(closestCircle.getAttribute("cx"));
        var circleY = parseFloat(closestCircle.getAttribute("cy"));
        var radius = parseFloat(closestCircle.getAttribute("r"));
        var angle = Math.atan2(lineEndY - circleY, lineEndX - circleX);
        var lineX = circleX + Math.cos(angle) * radius;
        var lineY = circleY + Math.sin(angle) * radius;
        lineA.setAttribute("x2", lineX);
        lineA.setAttribute("y2", lineY);
        localStorage.setItem("a_x", lineX)
        localStorage.setItem("a_y", lineY)

        let centerX = circleX, centerY = circleY;
        if (lineX <= centerX && lineY <= centerY) {
            A.setAttribute('x', lineX - 15);
            A.setAttribute('y', lineY - 15);
        } else if (lineX <= centerX && lineY >= centerY) {
            A.setAttribute('x', lineX - 15);
            A.setAttribute('y', lineY + 15);
        } else if (lineX >= centerX && lineY >= centerY) {
            A.setAttribute('x', lineX + 15);
            A.setAttribute('y', lineY + 15);
        } else if (lineX >= centerX && lineY <= centerY) {
            A.setAttribute('x', lineX + 10);
            A.setAttribute('y', lineY - 10);
        }
    }

    svgContainer.removeEventListener("mousemove", dragA);
    svgContainer.removeEventListener("mouseup", stopDragA);

}
function stopDragA_mobile(event) {
    isDragging = false;
    var lineEndX = parseFloat(lineA.getAttribute("x2"));
    var lineEndY = parseFloat(lineA.getAttribute("y2"));
    // console.log(lineEndX, " ", lineEndY)
    var circles = document.querySelectorAll("circle[id^='drawing-area']");
    var closestCircle;
    var minDistance = Number.MAX_VALUE;

    // 寻找离线终点最近的圆
    let flag = 0, MaxCircle, pre_r = 0;
    circles.forEach(function (circle) {
        var circleX = parseFloat(circle.getAttribute("cx"));
        var circleY = parseFloat(circle.getAttribute("cy"));
        var radius = parseFloat(circle.getAttribute("r"));
        var distance = Math.sqrt(Math.pow(lineEndX - circleX, 2) + Math.pow(lineEndY - circleY, 2));
        if (distance <= minDistance && distance < radius) {
            // console.log(circleX + " " + circleY + " " + radius + " " + distance)
            minDistance = distance;
            closestCircle = circle;
            flag = 1
        }
        if (pre_r < radius) {
            MaxCircle = circle
            pre_r = radius
        }
    });
    if (flag === 0) closestCircle = MaxCircle

    // 更新线的终点为交点坐标
    if (closestCircle) {
        var circleX = parseFloat(closestCircle.getAttribute("cx"));
        var circleY = parseFloat(closestCircle.getAttribute("cy"));
        var radius = parseFloat(closestCircle.getAttribute("r"));
        var angle = Math.atan2(lineEndY - circleY, lineEndX - circleX);
        var lineX = circleX + Math.cos(angle) * radius;
        var lineY = circleY + Math.sin(angle) * radius;
        lineA.setAttribute("x2", lineX);
        lineA.setAttribute("y2", lineY);
        localStorage.setItem("a_x", lineX)
        localStorage.setItem("a_y", lineY)

        let centerX = circleX, centerY = circleY;
        if (lineX <= centerX && lineY <= centerY) {
            A.setAttribute('x', lineX - 15);
            A.setAttribute('y', lineY - 15);
        } else if (lineX <= centerX && lineY >= centerY) {
            A.setAttribute('x', lineX - 15);
            A.setAttribute('y', lineY + 15);
        } else if (lineX >= centerX && lineY >= centerY) {
            A.setAttribute('x', lineX + 15);
            A.setAttribute('y', lineY + 15);
        } else if (lineX >= centerX && lineY <= centerY) {
            A.setAttribute('x', lineX + 10);
            A.setAttribute('y', lineY - 10);
        }
    }
    svgContainer.removeEventListener("touchmove", dragA_mobile);
    svgContainer.removeEventListener("touchend", stopDragA_mobile);
}

/*********************************************
 *
 * B监听
 */
isDragging = false;
// 开始拖动
function startDragB(event) {
    isDragging = true;
    // 鼠标移动事件处理程序
    svgContainer.addEventListener("mousemove", dragB);
    svgContainer.addEventListener("touchmove", dragB_mobile);
    // 鼠标释放事件处理程序
    svgContainer.addEventListener("mouseup", stopDragB);
    svgContainer.addEventListener("touchend", stopDragB_mobile);
}
// 拖动过程中更新线的位置
function dragB(event) {
    if (isDragging) {
        let svgRect = svgContainer.getBoundingClientRect();
        let lineX = event.clientX - svgRect.left;
        let lineY = event.clientY - svgRect.top;
        lineB.setAttribute("x2", lineX);
        lineB.setAttribute("y2", lineY);

        // 更新文字位置
        let centerX = 125, centerY = 125;
        if (lineX <= centerX && lineY <= centerY) {
            B.setAttribute('x', lineX - 15);
            B.setAttribute('y', lineY - 15);
        } else if (lineX <= centerX && lineY >= centerY) {
            B.setAttribute('x', lineX - 15);
            B.setAttribute('y', lineY + 15);
        } else if (lineX >= centerX && lineY >= centerY) {
            B.setAttribute('x', lineX + 15);
            B.setAttribute('y', lineY + 15);
        } else if (lineX >= centerX && lineY <= centerY) {
            B.setAttribute('x', lineX + 10);
            B.setAttribute('y', lineY - 10);
        }
    }
}
function dragB_mobile(event) {
    if (isDragging) {
        let svgRect = svgContainer.getBoundingClientRect();
        let lineX = event.touches[0].clientX - svgRect.left;
        let lineY = event.touches[0].clientY - svgRect.top;
        // console.log(svgRect + " " + event.touches[0].clientX + ", " + event.touches[0].clientY)
        lineB.setAttribute("x2", lineX);
        lineB.setAttribute("y2", lineY);
        // console.log("moveA --> " + lineX + " " + lineY)

        // 更新文字位置
        let centerX = 125, centerY = 125;
        if (lineX <= centerX && lineY <= centerY) {
            B.setAttribute('x', lineX - 15);
            B.setAttribute('y', lineY - 15);
        } else if (lineX <= centerX && lineY >= centerY) {
            B.setAttribute('x', lineX - 15);
            B.setAttribute('y', lineY + 15);
        } else if (lineX >= centerX && lineY >= centerY) {
            B.setAttribute('x', lineX + 15);
            B.setAttribute('y', lineY + 15);
        } else if (lineX >= centerX && lineY <= centerY) {
            B.setAttribute('x', lineX + 10);
            B.setAttribute('y', lineY - 10);
        }
    }
}

// 拖动结束时延伸线到离线终点外最近的圆的边上
function stopDragB(event) {
    isDragging = false;
    var lineEndX = parseFloat(lineB.getAttribute("x2"));
    var lineEndY = parseFloat(lineB.getAttribute("y2"));
    // console.log(lineEndX, " ", lineEndY)
    var circles = document.querySelectorAll("circle[id^='drawing-area']");
    var closestCircle;
    var minDistance = Number.MAX_VALUE;

    // 寻找离线终点最近的圆
    let flag = 0, MaxCircle, pre_r = 0;
    circles.forEach(function (circle) {
        var circleX = parseFloat(circle.getAttribute("cx"));
        var circleY = parseFloat(circle.getAttribute("cy"));
        var radius = parseFloat(circle.getAttribute("r"));
        var distance = Math.sqrt(Math.pow(lineEndX - circleX, 2) + Math.pow(lineEndY - circleY, 2));
        if (distance <= minDistance && distance < radius) {
            // console.log(circleX + " " + circleY + " " + radius + " " + distance)
            minDistance = distance;
            closestCircle = circle;
            flag = 1
        }
        if (pre_r < radius) {
            MaxCircle = circle
            pre_r = radius
        }
    });
    if (flag === 0) closestCircle = MaxCircle

    // 更新线的终点为交点坐标
    if (closestCircle) {
        var circleX = parseFloat(closestCircle.getAttribute("cx"));
        var circleY = parseFloat(closestCircle.getAttribute("cy"));
        var radius = parseFloat(closestCircle.getAttribute("r"));
        var angle = Math.atan2(lineEndY - circleY, lineEndX - circleX);
        var lineX = circleX + Math.cos(angle) * radius;
        var lineY = circleY + Math.sin(angle) * radius;
        lineB.setAttribute("x2", lineX);
        lineB.setAttribute("y2", lineY);
        localStorage.setItem("b_x", lineX)
        localStorage.setItem("b_y", lineY)

        let centerX = circleX, centerY = circleY;
        if (lineX <= centerX && lineY <= centerY) {
            B.setAttribute('x', lineX - 15);
            B.setAttribute('y', lineY - 15);
        } else if (lineX <= centerX && lineY >= centerY) {
            B.setAttribute('x', lineX - 15);
            B.setAttribute('y', lineY + 15);
        } else if (lineX >= centerX && lineY >= centerY) {
            B.setAttribute('x', lineX + 15);
            B.setAttribute('y', lineY + 15);
        } else if (lineX >= centerX && lineY <= centerY) {
            B.setAttribute('x', lineX + 10);
            B.setAttribute('y', lineY - 10);
        }
    }

    svgContainer.removeEventListener("mousemove", dragB);
    svgContainer.removeEventListener("mouseup", stopDragB);

}
function stopDragB_mobile(event) {
    isDragging = false;
    var lineEndX = parseFloat(lineB.getAttribute("x2"));
    var lineEndY = parseFloat(lineB.getAttribute("y2"));
    // console.log(lineEndX, " ", lineEndY)
    var circles = document.querySelectorAll("circle[id^='drawing-area']");
    var closestCircle;
    var minDistance = Number.MAX_VALUE;

    // 寻找离线终点最近的圆
    let flag = 0, MaxCircle, pre_r = 0;
    circles.forEach(function (circle) {
        var circleX = parseFloat(circle.getAttribute("cx"));
        var circleY = parseFloat(circle.getAttribute("cy"));
        var radius = parseFloat(circle.getAttribute("r"));
        var distance = Math.sqrt(Math.pow(lineEndX - circleX, 2) + Math.pow(lineEndY - circleY, 2));
        if (distance <= minDistance && distance < radius) {
            // console.log(circleX + " " + circleY + " " + radius + " " + distance)
            minDistance = distance;
            closestCircle = circle;
            flag = 1
        }
        if (pre_r < radius) {
            MaxCircle = circle
            pre_r = radius
        }
    });
    if (flag === 0) closestCircle = MaxCircle

    // 更新线的终点为交点坐标
    if (closestCircle) {
        var circleX = parseFloat(closestCircle.getAttribute("cx"));
        var circleY = parseFloat(closestCircle.getAttribute("cy"));
        var radius = parseFloat(closestCircle.getAttribute("r"));
        var angle = Math.atan2(lineEndY - circleY, lineEndX - circleX);
        var lineX = circleX + Math.cos(angle) * radius;
        var lineY = circleY + Math.sin(angle) * radius;
        lineB.setAttribute("x2", lineX);
        lineB.setAttribute("y2", lineY);
        localStorage.setItem("b_x", lineX)
        localStorage.setItem("b_y", lineY)

        let centerX = circleX, centerY = circleY;
        if (lineX <= centerX && lineY <= centerY) {
            B.setAttribute('x', lineX - 15);
            B.setAttribute('y', lineY - 15);
        } else if (lineX <= centerX && lineY >= centerY) {
            B.setAttribute('x', lineX - 15);
            B.setAttribute('y', lineY + 15);
        } else if (lineX >= centerX && lineY >= centerY) {
            B.setAttribute('x', lineX + 15);
            B.setAttribute('y', lineY + 15);
        } else if (lineX >= centerX && lineY <= centerY) {
            B.setAttribute('x', lineX + 10);
            B.setAttribute('y', lineY - 10);
        }
    }
    svgContainer.removeEventListener("touchmove", dragB_mobile);
    svgContainer.removeEventListener("touchend", stopDragB_mobile);
}

/*********************************************
 *
 * C监听
 */
isDragging = false;
// 开始拖动
function startDragC(event) {
    isDragging = true;
    // 鼠标移动事件处理程序
    svgContainer.addEventListener("mousemove", dragC);
    svgContainer.addEventListener("touchmove", dragC_mobile);
    // 鼠标释放事件处理程序
    svgContainer.addEventListener("mouseup", stopDragC);
    svgContainer.addEventListener("touchend", stopDragC_mobile);
}
// 拖动过程中更新线的位置
function dragC(event) {
    if (isDragging) {
        let svgRect = svgContainer.getBoundingClientRect();
        let lineX = event.clientX - svgRect.left;
        let lineY = event.clientY - svgRect.top;
        lineC.setAttribute("x2", lineX);
        lineC.setAttribute("y2", lineY);

        // 更新文字位置
        let centerX = 125, centerY = 125;
        if (lineX <= centerX && lineY <= centerY) {
            C.setAttribute('x', lineX - 15);
            C.setAttribute('y', lineY - 15);
        } else if (lineX <= centerX && lineY >= centerY) {
            C.setAttribute('x', lineX - 15);
            C.setAttribute('y', lineY + 15);
        } else if (lineX >= centerX && lineY >= centerY) {
            C.setAttribute('x', lineX + 15);
            C.setAttribute('y', lineY + 15);
        } else if (lineX >= centerX && lineY <= centerY) {
            C.setAttribute('x', lineX + 10);
            C.setAttribute('y', lineY - 10);
        }
    }
}
function dragC_mobile(event) {
    if (isDragging) {
        let svgRect = svgContainer.getBoundingClientRect();
        let lineX = event.touches[0].clientX - svgRect.left;
        let lineY = event.touches[0].clientY - svgRect.top;
        // console.log(svgRect + " " + event.touches[0].clientX + ", " + event.touches[0].clientY)
        lineC.setAttribute("x2", lineX);
        lineC.setAttribute("y2", lineY);
        // console.log("moveA --> " + lineX + " " + lineY)

        // 更新文字位置
        let centerX = 125, centerY = 125;
        if (lineX <= centerX && lineY <= centerY) {
            C.setAttribute('x', lineX - 15);
            C.setAttribute('y', lineY - 15);
        } else if (lineX <= centerX && lineY >= centerY) {
            C.setAttribute('x', lineX - 15);
            C.setAttribute('y', lineY + 15);
        } else if (lineX >= centerX && lineY >= centerY) {
            C.setAttribute('x', lineX + 15);
            C.setAttribute('y', lineY + 15);
        } else if (lineX >= centerX && lineY <= centerY) {
            C.setAttribute('x', lineX + 10);
            C.setAttribute('y', lineY - 10);
        }
    }
}

// 拖动结束时延伸线到离线终点外最近的圆的边上
function stopDragC(event) {
    isDragging = false;
    var lineEndX = parseFloat(lineC.getAttribute("x2"));
    var lineEndY = parseFloat(lineC.getAttribute("y2"));
    // console.log(lineEndX, " ", lineEndY)
    var circles = document.querySelectorAll("circle[id^='drawing-area']");
    var closestCircle;
    var minDistance = Number.MAX_VALUE;

    // 寻找离线终点最近的圆
    let flag = 0, MaxCircle, pre_r = 0;
    circles.forEach(function (circle) {
        var circleX = parseFloat(circle.getAttribute("cx"));
        var circleY = parseFloat(circle.getAttribute("cy"));
        var radius = parseFloat(circle.getAttribute("r"));
        var distance = Math.sqrt(Math.pow(lineEndX - circleX, 2) + Math.pow(lineEndY - circleY, 2));
        if (distance <= minDistance && distance < radius) {
            // console.log(circleX + " " + circleY + " " + radius + " " + distance)
            minDistance = distance;
            closestCircle = circle;
            flag = 1
        }
        if (pre_r < radius) {
            MaxCircle = circle
            pre_r = radius
        }
    });
    if (flag === 0) closestCircle = MaxCircle

    // 更新线的终点为交点坐标
    if (closestCircle) {
        var circleX = parseFloat(closestCircle.getAttribute("cx"));
        var circleY = parseFloat(closestCircle.getAttribute("cy"));
        var radius = parseFloat(closestCircle.getAttribute("r"));
        var angle = Math.atan2(lineEndY - circleY, lineEndX - circleX);
        var lineX = circleX + Math.cos(angle) * radius;
        var lineY = circleY + Math.sin(angle) * radius;
        lineC.setAttribute("x2", lineX);
        lineC.setAttribute("y2", lineY);
        localStorage.setItem("c_x", lineX)
        localStorage.setItem("c_y", lineY)

        let centerX = circleX, centerY = circleY;
        if (lineX <= centerX && lineY <= centerY) {
            C.setAttribute('x', lineX - 15);
            C.setAttribute('y', lineY - 15);
        } else if (lineX <= centerX && lineY >= centerY) {
            C.setAttribute('x', lineX - 15);
            C.setAttribute('y', lineY + 15);
        } else if (lineX >= centerX && lineY >= centerY) {
            C.setAttribute('x', lineX + 15);
            C.setAttribute('y', lineY + 15);
        } else if (lineX >= centerX && lineY <= centerY) {
            C.setAttribute('x', lineX + 10);
            C.setAttribute('y', lineY - 10);
        }
    }

    svgContainer.removeEventListener("mousemove", dragC);
    svgContainer.removeEventListener("mouseup", stopDragC);

}
function stopDragC_mobile(event) {
    isDragging = false;
    var lineEndX = parseFloat(lineC.getAttribute("x2"));
    var lineEndY = parseFloat(lineC.getAttribute("y2"));
    // console.log(lineEndX, " ", lineEndY)
    var circles = document.querySelectorAll("circle[id^='drawing-area']");
    var closestCircle;
    var minDistance = Number.MAX_VALUE;

    // 寻找离线终点最近的圆
    let flag = 0, MaxCircle, pre_r = 0;
    circles.forEach(function (circle) {
        var circleX = parseFloat(circle.getAttribute("cx"));
        var circleY = parseFloat(circle.getAttribute("cy"));
        var radius = parseFloat(circle.getAttribute("r"));
        var distance = Math.sqrt(Math.pow(lineEndX - circleX, 2) + Math.pow(lineEndY - circleY, 2));
        if (distance <= minDistance && distance < radius) {
            // console.log(circleX + " " + circleY + " " + radius + " " + distance)
            minDistance = distance;
            closestCircle = circle;
            flag = 1
        }
        if (pre_r < radius) {
            MaxCircle = circle
            pre_r = radius
        }
    });
    if (flag === 0) closestCircle = MaxCircle

    // 更新线的终点为交点坐标
    if (closestCircle) {
        var circleX = parseFloat(closestCircle.getAttribute("cx"));
        var circleY = parseFloat(closestCircle.getAttribute("cy"));
        var radius = parseFloat(closestCircle.getAttribute("r"));
        var angle = Math.atan2(lineEndY - circleY, lineEndX - circleX);
        var lineX = circleX + Math.cos(angle) * radius;
        var lineY = circleY + Math.sin(angle) * radius;
        lineC.setAttribute("x2", lineX);
        lineC.setAttribute("y2", lineY);
        localStorage.setItem("c_x", lineX)
        localStorage.setItem("c_y", lineY)

        let centerX = circleX, centerY = circleY;
        if (lineX <= centerX && lineY <= centerY) {
            C.setAttribute('x', lineX - 15);
            C.setAttribute('y', lineY - 15);
        } else if (lineX <= centerX && lineY >= centerY) {
            C.setAttribute('x', lineX - 15);
            C.setAttribute('y', lineY + 15);
        } else if (lineX >= centerX && lineY >= centerY) {
            C.setAttribute('x', lineX + 15);
            C.setAttribute('y', lineY + 15);
        } else if (lineX >= centerX && lineY <= centerY) {
            C.setAttribute('x', lineX + 10);
            C.setAttribute('y', lineY - 10);
        }
    }
    svgContainer.removeEventListener("touchmove", dragC_mobile);
    svgContainer.removeEventListener("touchend", stopDragC_mobile);
}
