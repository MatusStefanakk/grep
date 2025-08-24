    // --- Všetky triedy definované vnútorné ---
    class CultureUI {
        constructor(mainDiv) {
            this.mainDiv = mainDiv;
        }
        createHeading() {
            const heading = document.createElement("h3");
            heading.textContent = "AutoCulture";
            heading.style.color = "Yellow";
            return heading;
        }
        createDropDown(optionValues, name) {
            const dropDown = document.createElement("select");
            dropDown.setAttribute("name", name);
            for (let i = 0; i < optionValues.length; i++) {
                const option = document.createElement("option");
                option.text = optionValues[i];
                dropDown.appendChild(option);
            }
            return dropDown;
        }
        createButton() {
            const button = document.createElement("button");
            button.textContent = "Start";
            button.addEventListener("click", function() {
                let ac = new AutoCulture();
                const dropDown = document.querySelector("select[name='culture-drop-down']");
                const optDropDown = document.querySelector("select[name='option-drop-down']");
                ac.run(optDropDown.value, dropDown.value);
            });
            return button;
        }
        createAutoCultureDiv(name) {
            const div = document.createElement("div");
            div.className = name;
            return div;
        }
        createCultureUI() {
            const optionValues = ["Mestský festival", "Olympijské hry", "Víťazná procesia", "Divadelné hry"];
            const optionValues1 = ["02:00:00", "04:00:00", "08:00:00", "10:00:00", "11:00:00", "12:00:00"];
            const heading = this.createHeading();
            const dropDown = this.createDropDown(optionValues, "option-drop-down");
            const dropDown1 = this.createDropDown(optionValues1, "culture-drop-down");
            const button = this.createButton();
            const div1 = this.createAutoCultureDiv("auto-culture-options");
            const div2 = this.createAutoCultureDiv("auto-culture-timer");
            div1.appendChild(dropDown);
            div2.appendChild(dropDown1);
            div2.appendChild(button);
            this.mainDiv.appendChild(heading);
            this.mainDiv.appendChild(div1);
            this.mainDiv.appendChild(div2);
        }
    }

    class FarmUI {
        constructor(mainDiv) {
            this.mainDiv = mainDiv;
        }
        createHeading() {
            const h = document.createElement("h3");
            h.textContent = "AutoFarm";
            h.style.color = "green";
            return h;
        }
        createDropDown() {
            const dropDown = document.createElement("select");
            dropDown.setAttribute("name", "farm-drop-down");
            const optionValues = ["00:05:00", "00:10:00", "00:20:00", "00:40:00", "01:30:00", "03:00:00", "04:00:00", "08:00:00"];
            optionValues.forEach(v => {
                const o = document.createElement("option");
                o.text = v;
                dropDown.appendChild(o);
            });
            return dropDown;
        }
        createButton() {
            const button = document.createElement("button");
            button.textContent = "Start";
            button.addEventListener("click", () => {
                let af = new AutoFarm();
                const dropDown = document.querySelector("select[name='farm-drop-down']");
                af.run(dropDown.value);
            });
            return button;
        }
        createAutoFarmDiv() {
            const div = document.createElement("div");
            div.className = "auto-farm";
            return div;
        }
        createFarmUI() {
            const heading = this.createHeading();
            const dropDown = this.createDropDown();
            const button = this.createButton();
            const div = this.createAutoFarmDiv();
            div.appendChild(dropDown);
            div.appendChild(button);
            this.mainDiv.appendChild(heading);
            this.mainDiv.appendChild(div);
        }
    }

class MainUI {
    constructor() {
        this.createMainDiv();
    }

    createMainDiv() {
        const utils = new Utils();
        utils.waitForElementToAppear(".ui_construction_queue.instant_buy", (panel) => {
            this.panel = panel;
            this.mainDiv = document.createElement("div");
            this.mainDiv.setAttribute("name", "bot-main-div");
            Object.assign(this.mainDiv.style, {
                position: "absolute",
                left: "0px",
                top: "0px",
                width: "300px",
                height: "500px",
                backgroundColor: "rgba(0, 0, 10, 0.5)",
                zIndex: "1000",
                borderRadius: "10px"
            });
            let parentDiv = this.panel.parentNode;
            parentDiv.insertBefore(this.mainDiv, this.panel);

            // --- Až teraz môžeme spustiť tieto veci ---
            this.addDragFunctionality();
            this.createAutoFarmUI();
        }, 100, 50);
    }

    addDragFunctionality() {
        if (!this.mainDiv) return; // bezpečnostná kontrola
        let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;
        const startDrag = (e) => {
            isDragging = true;
            dragOffsetX = e.clientX - this.mainDiv.offsetLeft;
            dragOffsetY = e.clientY - this.mainDiv.offsetTop;
        };
        const endDrag = () => { isDragging = false; };
        const drag = (e) => {
            if (isDragging) {
                this.mainDiv.style.left = e.clientX - dragOffsetX + "px";
                this.mainDiv.style.top = e.clientY - dragOffsetY + "px";
            }
        };
        this.mainDiv.addEventListener("mousedown", startDrag);
        document.addEventListener("mouseup", endDrag);
        document.addEventListener("mousemove", drag);
    }

    createAutoFarmUI() {
        const farm = new FarmUI(this.mainDiv);
        farm.createFarmUI();
        const culture = new CultureUI(this.mainDiv);
        culture.createCultureUI();
    }
}


    class Utils {
        timeout(ms) {
            return new Promise(r => setTimeout(r, ms));
        }
        generateDelay() {
            return Math.floor(Math.random() * (601 - 300) + 300);
        }
        convertToSeconds(t) {
            const [h, m, s] = t.split(":");
            return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s);
        }
        waitForElementToAppear(selector, callback, interval = 100, maxAttempts = 10) {
            let attempts = 0;
            const timer = setInterval(() => {
                attempts++;
                const element = document.querySelector(selector);
                if (element || attempts >= maxAttempts) {
                    clearInterval(timer);
                    if (element) {
                        callback(element);
                    } else {
                        console.log("Element not found.");
                    }
                }
            }, interval);
        }
    }

    class AutoFarm {
        constructor() {
            this.utils = new Utils();
        }
        async run(time) {
            console.log("AutoFarm running with", time);
            const seconds = this.utils.convertToSeconds(time);
            this.seconds = seconds;
            while (true) {
                console.log("Farming...");
                await this.utils.timeout(this.seconds * 1000 + Math.floor(Math.random() * (30000 - 5000) + 5000));
            }
        }
    }

    class AutoCulture {
        constructor() {
            this.utils = new Utils();
        }
        async run(opt, time) {
            console.log("AutoCulture running", opt, time);
            const seconds = this.utils.convertToSeconds(time);
            this.seconds = seconds;
            await this.utils.timeout(this.seconds * 1000 + Math.floor(Math.random() * (900000 - 180000) + 120000));
        }
    }

    // --- Inicializácia ---
    new MainUI();
