/**
 * Created by forshah on 3/24/2015.
 */
window.onload = function() {
    init();
    function init() {
        $("#layoutArea").sortable();
        var layoutCells = document.getElementsByClassName("layoutCell");
        var palletImgs = document.getElementsByClassName("palletImg");
        var horizontalScissors = document.getElementsByClassName("horizontalScissor");
        var verticalScissors = document.getElementsByClassName("verticalScissor");
        var saveLayout = document.getElementById("saveLayout");
        var layoutName = document.getElementById("layoutName");
        var selectLayout = document.getElementById("selectLayout");
        var btnLoadLayout = document.getElementById("loadLayout");

        $(btnLoadLayout).click(function() {
            var selectedVal = $(selectLayout).val();
            if(validateLayoutSelect()) {
                loadLayouts().done(function(data) {
                    var backgroundImages = data[selectedVal];
                    for(var i = 0; i < layoutCells.length; i++) {
                        $(layoutCells[i]).css("background-image", backgroundImages[i]);
                        $(layoutName).val(selectedVal);
                    }
                    $(selectLayout).val("Please Select Layout");
                    showAlert("alert-success", "Layout Successfully Loaded! ");
                });
            }
        });
        $(selectLayout).change(function() {
            validateLayoutSelect();
        });

        function loadLayouts() {
            return $.ajax({
                url: "/api/index",
                method: "get"
            })
        }

        function loadLayoutSelect(layouts) {
            $(selectLayout).empty();
            $(selectLayout).append($("<option>").html("Please Select Layout").val("Please Select Layout"));
            for(var layoutName in layouts) {
                $(selectLayout).append($("<option>").html(layoutName).val(layoutName));
            }
        }

        $(saveLayout).click(function() {
            if(validateLayoutName()) {
                var jsonObj = {
                    "layoutName": $(layoutName).val(),
                    "layoutCells": []
                };
                for(var i = 0; i < layoutCells.length; i++) {
                    jsonObj["layoutCells"].push($(layoutCells[i]).css("background-image"));
                    if(i === layoutCells.length - 1) {
                        $.ajax({
                            url: "/api/index",
                            method: "post",
                            data: jsonObj
                        }).done(function(data) {
                            console.log(data);
                            loadLayoutSelect(data);
                            $(selectLayout).val("Please Select Layout");
                            showAlert("alert-success", "Layout Successfully Saved! ");
                        });
                    }
                }
            }
        });
        $(layoutName).keyup(function() {
            validateLayoutName();
        });
        function validateLayoutName() {
            ////***To save our app from cross side scripting
            if(!layoutName.validity.valid) {
                $(layoutName).addClass("error");
                return false;
            }
            else {
                $(layoutName).removeClass("error");
                return true;
            }
        }

        function validateLayoutSelect() {
            ////***To save our app from cross side scripting
            if($(selectLayout).val() === "Please Select Layout") {
                $(selectLayout).addClass("error");
                return false;
            }
            else {
                $(selectLayout).removeClass("error");
                return true;
            }
        }

        $(palletImgs).on("dragstart", function(ev) {
            drag(ev);
        });
        $(layoutCells).on("drop", function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            drop(ev);
        });
        $(layoutCells).on("dragover", function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            allowDrop(ev);
        });
        $(horizontalScissors).click(function() {
            var layoutCell = $(this).parents(".layoutCell");
            var height = parseInt(layoutCell.css("height"));
            var newDiv = $("<div>").addClass("flexStyleCol");
            layoutCell.css("height", (height / 2) + "px");
            newDiv.insertBefore(layoutCell);
            newDiv.append(layoutCell);
            layoutCell.clone(true, true).insertAfter(layoutCell);
        });
        $(verticalScissors).click(function() {
            var layoutCell = $(this).parent(".layoutCell");
            var width = parseInt(layoutCell.css("width"));
            var newDiv = $("<div>").addClass("flexStyle");
            layoutCell.css("width", (width / 2) + "px");
            newDiv.insertBefore(layoutCell);
            newDiv.append(layoutCell);
            layoutCell.clone(true, true).insertAfter(layoutCell);
        });

        function allowDrop(ev) {
            ev.preventDefault();
        }

        function drop(ev) {
            if(ev.target.classList.contains("horizontalScissor") || ev.target.classList.contains("verticalScissor")) {
                return false;
            }
            var src = ev.originalEvent.dataTransfer.getData("src");
            $(ev.target).css({
                "background-image": "url(" + src + ")",
                "background-size": "100% 100%"
            });
        }

        function drag(ev) {
            ev.originalEvent.dataTransfer.setData("src", ev.target.src);
        }

        function showAlert(alertClass, alertMessage) {
            $("." + alertClass + " .alertMessage").html(" " + alertMessage);
            $("." + alertClass).fadeIn("slow");
            setTimeout(function() {
                $("." + alertClass).fadeOut("slow");
            }, 4000);
        }
    }
}
