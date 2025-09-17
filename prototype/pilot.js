var fromVtoPbtn = $("#fromP");
var fromPtoTbtn = $("#toP");
var fromPcols = $(".editions").find(".p-to-t");
var toPcols = $(".editions").find(".v-to-p");

const select = $("#ms-var-ctrl");
const divs = $(".layer-div");

var paragButton = $("#parag-var")
var paragVariants = $(".paragraphemic")

var entitiesButton = $("#entities-btn")
var entities = $(".persname")

var quotations = $("q")

var quotedWorks = {
    "bibl_02c": {
        "author": "Dante Alighieri",
        "title": "Commedia",
        "unit_1": "Inferno",
        "unit_2": "2",
        "scope": "2"
    },
    "bibl_02d": {
        "author": "Dante Alighieri",
        "title": "Commedia",
        "unit_1": "Paradiso",
        "unit_2": "25",
        "scope": "109-111"
    },
    "bibl_02e": {
        "author": "Dante Alighieri",
        "title": "Commedia",
        "unit_1": "Purgatorio",
        "unit_2": "14",
        "scope": "65-66"
    },
    "bibl_01c": {
        "author": "Giovanni Boccaccio",
        "title": "Decameron",
        "unit_1": "VI",
        "unit_2": "Conclusione",
        "scope": "45"
    },
    "bibl_04a": {
        "author": "Lupo degli Uberti",
        "title": "Gentil Madonna",
        "scope": "45"
    },
    "bibl_05a": {
        "author": "Enzo di Sardegna",
        "title": "S'eo trovasse Pietanza",
        "scope": "45"
    },
    "bibl_06a": {
        "author": "Francesco Petrarca",
        "title": "Trionfi",
        "unit_1": "Triumphus Cupidinis",
        "unit_2": "IV",
        "scope": "32"
    },
    "bibl_03a": {
        "author": "Francesco Petrarca",
        "title": "Rerum Vulgarium Fragmenta",
        "unit_1": "214",
        "scope": "10"
    },
    "bibl_02a": {
        "author": "Dante Alighieri",
        "title": "Commedia",
        "unit_1": "Inferno",
        "unit_2": "30",
        "scope": "113-114"
    },
}

var witnessInfo = $(".wit-info")
var witnessOverlay = $(".witness-overlay")

$(document).ready(function(){
        // show phase 2
        fromPtoTbtn.on("click",function(){
            fromPtoT()
        })
        // show phase 1
        fromVtoPbtn.on("click", function(){
            fromVtoP()
        })

    function fromPtoT() {
        console.log("fromPtoT button has been clicked")
        toPcols.removeClass("d-none")
        fromPcols.addClass("d-none")
    } 
    function fromVtoP() {
        console.log("fromVtoP button has been clicked")
        toPcols.addClass("d-none")
        fromPcols.removeClass("d-none")
    }

    // update text on select
    select.on("change", function(e){
        var option = e.target.value

        divs.each(function(){
            $(this).toggleClass("d-none", this.id !== option);
        }
    );
    });

    // highlight paragraphemic variants
    paragButton.on("click", function(){
        paragVariants.each(function(){
            $(this).toggleClass("visible");
        })
        // Toggle button text
        if (paragButton.text() === "Show paragraphemic variants") {
            paragButton.text("Hide paragraphemic variants");
        } else {
            paragButton.text("Show paragraphemic variants");
        }
    });
    
    // highlight entities 
    entitiesButton.on("click", function(){
        entities.each(function(){
            $(this).toggleClass("visible");
        })
        // Toggle button text
        if (entitiesButton.text() === "Highlight Entities") {
            entitiesButton.text("Hide Entities");
        } else {
            entitiesButton.text("Highlight Entities");
        }
    });

    // show entities tooltip
    $(document).on("click", ".persname", function(e) {
    e.preventDefault();
    const $this = $(this);
    let tooltip = $this.data("tooltip"); // get existing tooltip if any

    if (tooltip) {
        // Tooltip exists: remove it
        tooltip.remove();
        $this.removeData("tooltip");
    } else {
        // Get values from data attributes
        const label = $this.data("label");
        const authority = $this.data("authority");

        // Detect source based on URI
        let sourceLabel = "";
        if (authority.includes("viaf.org")) {
            sourceLabel = "VIAF";
        } else if (authority.includes("wikidata.org")) {
            sourceLabel = "Wikidata";
        } else {
            sourceLabel = "External link";
        }

        // Create tooltip content
        const tooltipContent = `<strong>${label}</strong><br><a href="${authority}" target="_blank">${sourceLabel}</a><br><a class="disabled" title="Lists not available">Go to people index</a>`;

        // Create tooltip element
        tooltip = $(`<span class="custom-tooltip">${tooltipContent}</span>`);

        const offset = $this.offset(); // get position of the clicked element

        tooltip.css({
            position: "absolute",
            top: offset.top + $this.outerHeight(),
            left: offset.left,
            background: "rgba(255, 255, 255, 0.9)",
            border: "1px solid black",
            color: "#black",
            padding: "5px 8px",
            borderRadius: "4px",
            whiteSpace: "nowrap",
            zIndex: 999
        });

        // Append to body and store reference
        $("body").append(tooltip);
        $this.data("tooltip", tooltip);
    }
});

    // Assuming quote is a list of elements with a .quote class
    quotations.each(function () {
        $(this).on("click", function () {
            var biblKey = $(this).attr("data-bibl");

        // Check if the key exists in quotedWorks
        if (quotedWorks.hasOwnProperty(biblKey)) {
            var content = quotedWorks[biblKey];

              if (quotedWorks) {
                const html = `
                    <p>${content.author},
                    <i>${content.title}</i>,
                    <i>${content.unit_1 || ""}</i>,
                    ${content.unit_2 || ""},
                    ${content.scope}</p>
                `;

            $("#bibl-ref-modal").html(html);
        } else {
            $("#bibl-ref-modal").html("<em>No details available for this quote.</em>");
        }

            // Show the modal (Bootstrap 5)
            var modal = new bootstrap.Modal(document.getElementById("quotations"));
            modal.show();
        } else {
            console.warn("No content found for data-bibl:", biblKey);
        }
    });
});

    // toggle witness visibility
    function toggleOverlay(wit) {
        const overlay = $(`.witness-overlay[data-wit='${wit}']`);
        const isVisible = overlay.hasClass("visible");

        overlay.toggleClass("visible");

        const scrollContainer = $(".col-ed"); 

        if (!isVisible) {
            // Overlay is being shown
            scrollContainer.css("overflow", "hidden");
        } else {
            // Overlay is being hidden
            scrollContainer.css("overflow", "scroll");
        }
    }

    // Toggle overlay open
    witnessInfo.on("click", function () {
        const wit = $(this).data("wit");
        console.log("Click event fired for ID", wit);
        toggleOverlay(wit);
    });

    // Close overlay on button click
    $(".witness-overlay .close-overlay").on("click", function () {
        const overlay = $(this).closest(".witness-overlay");
        overlay.removeClass("visible");

    // Re-enable scrolling
    $(".col-ed").css("overflow", "scroll");
});


});

    