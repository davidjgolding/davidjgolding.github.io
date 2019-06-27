/* Animation to move about front and shadow together */
function aboutAnimation() {
    $("#aboutFront").animate({ right: "80px" });
    $("#aboutBack").css({
        animation: "shadowAnimation 0.5s",
        transform: "translate(-30px, 10px)"
    });
}

/* Check if element is visable */
function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return (
        (elemBottom <= docViewBottom * 1.03 && elemTop * 1.2 >= docViewTop) ||
        (elemBottom >= docViewBottom && elemTop <= docViewTop)
    );
}

/* Find the current slide */
function findView() {
    if (isScrolledIntoView($("#landing")) == true) {
        return "#landing";
    } else if (isScrolledIntoView($("#about")) == true) {
        return "#navAbout";
    } else if (isScrolledIntoView($("#experience"))) {
        return "#navExperience";
    } else if (isScrolledIntoView($("#contact")) == true) {
        return "#navContact";
    } else {
        return "none";
    }
}

/* Apply appropriate properties depending on current slide */
function selection() {
    let tags = ["#navAbout", "#navExperience", "#navContact"];
    let current = findView();
    console.log(current);
    // If the desktop site is displayed
    if ($("#aboutBack").is(":visible")) {
        // If about back is visable, play animation
        if (current == "#navAbout") {
            aboutAnimation();
        }
        // Disable snap scroll for experience
        if (current == "#navExperience") {
            $("body").css("scroll-snap-type", "y proximity");
            $("html").css("scroll-snap-type", "y proximity");
        } else if (current != "none") {
            $("body").css("scroll-snap-type", "both mandatory");
            $("html").css("scroll-snap-type", "both mandatory");
        }
    }
    // Change the nav bar for current slide
    if (current != "none") {
        for (i in tags) {
            if (tags[i] != current) {
                $(tags[i])
                    .removeClass("selected")
                    .addClass("unselected");
            } else {
                $(tags[i])
                    .removeClass("unselected")
                    .addClass("selected");
            }
        }
    }
}

/* Center experience grid based on screen size */
function centerGrid() {
    if ($("#grid").height() + 40 > $(window).height()) {
        $("#experience").css("padding", "60px 0px 0px 5px");
    } else {
        $("#experience").css("padding", "0px");
    }
}

$(document).ready(function() {
    // Centers project grid
    $(window).resize(function() {
        centerGrid();
    });
    centerGrid();
    // Displays mobile menu when clicked
    $("#mobileMenu").bind("click", function() {
        $("#navLinks").animate({ width: "toggle" });
    });
    // Form submission
    $("#contactForm").submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: "submit.php",
            type: "POST",
            data: $(this).serialize(),
            beforeSend: function() {
                $("#submitStatus").text("Just processing your message...");
                $("#submitStatus").removeClass("submitFailure");
                $("#submitStatus").removeClass("submitSuccess");
                $("#submitStatus").addClass("submitProcessing");
                $("#submit").attr("disabled", true);
            },
            success: function(state) {
                // If no error recieved, show message sent
                if (state == "    ") {
                    $("#submitStatus").text(
                        "Your message was successfully submitted."
                    );
                    $("#submitStatus").removeClass("submitProcessing");
                    $("#submitStatus").removeClass("submitFailure");
                    $("#submitStatus").addClass("submitSuccess");
                    $("#formWithoutTitle").css("display", "none");
                    $("#formTitle").text("See you soon!");
                    // If error receieved, show the appropriate error/errors
                } else {
                    let errorMessage = "Please check that ";
                    let errors = [];
                    $("#name").css("border-bottom", "1px solid black");
                    $("#email").css("border-bottom", "1px solid black");
                    $("#message").css("border-bottom", "1px solid black");
                    if (state.substring(0, 1) == 1) {
                        errors.push("your name");
                        $("#name").css("border-bottom", "1px solid red");
                    }
                    if (
                        state.substring(1, 2) == 2 ||
                        state.substring(3, 4) == 4
                    ) {
                        errors.push("your email address");
                        $("#email").css("border-bottom", "1px solid red");
                    }
                    if (state.substring(2, 3) == 3) {
                        errors.push("your message");
                        $("#message").css("border-bottom", "1px solid red");
                    }

                    // Correctly format message
                    for (var i = 0; i < errors.length; i++) {
                        if (i > 0) {
                            if (i == errors.length - 1) {
                                errorMessage +=
                                    " and " +
                                    errors[i] +
                                    " have been entered correctly.";
                            } else {
                                errorMessage += ", " + errors[i];
                            }
                        } else {
                            errorMessage += errors[i];
                        }
                    }
                    if (errors.length == 1) {
                        errorMessage += " has been entered correctly.";
                    }
                    $("#submit").attr("disabled", false);
                    $("#submitStatus").text(errorMessage);
                    $("#submitStatus").removeClass("submitProcessing");
                    $("#submitStatus").removeClass("submitSuccess");
                    $("#submitStatus").addClass("submitFailure");
                }
            }
        });
    });
});

/* Updates the navigation bar on scroll */
window.addEventListener("scroll", function(event) {
    selection();
});
