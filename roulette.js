document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const rouletteWheel = document.querySelector(".roulette-wheel");
  const lever = document.getElementById("lever");
  const powerLevel = document.getElementById("powerLevel");
  const powerValue = document.getElementById("powerValue");
  const selectedGoal = document.getElementById("selectedGoal");
  const goalDescription = document.getElementById("goalDescription");

  // Responsive icon sizing
  const isMobile = window.innerWidth < 768;
  const iconSize = isMobile ? 48 : 72;

  // Variables
  let isDragging = false;
  let startY = 0;
  let power = 0;
  let isSpinning = false;
  const segmentAngle = 360 / sdgData.length;
  const initialSegment = Math.floor(Math.random() * 17);
  let currentRotation = -segmentAngle / 2 + initialSegment * segmentAngle;
  let spinTimeout;

  // Create wheel segments
  createWheel();

  // Handle window resize
  window.addEventListener("resize", handleResize);

  // Lever event listeners
  lever.addEventListener("mousedown", startDrag);
  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", endDrag);

  // Touch events for mobile
  lever.addEventListener("touchstart", startDragTouch);
  document.addEventListener("touchmove", dragTouch);
  document.addEventListener("touchend", endDrag);

  // Handle window resize
  function handleResize() {
    // Recreate wheel with appropriate sizes for the current screen
    createWheel();
  }

  // Create wheel segments based on SDG data
  function createWheel() {
    rouletteWheel.style.transform = `rotate(${currentRotation}deg)`;

    // Clear any existing segments
    rouletteWheel.innerHTML = "";

    // Create segments using CSS conic-gradient for better color rendering
    const wheelBackground = document.createElement("div");
    wheelBackground.style.position = "absolute";
    wheelBackground.style.width = "100%";
    wheelBackground.style.height = "100%";
    wheelBackground.style.borderRadius = "50%";

    // Build the conic gradient string
    const conicGradient = `conic-gradient(${sdgData
      .map((goal, index) => {
        const startAngle = index * segmentAngle;
        const endAngle = (index + 1) * segmentAngle;
        return `${goal.color} ${startAngle}deg ${endAngle}deg`;
      })
      .join(", ")})
    `;

    wheelBackground.style.background = conicGradient;
    wheelBackground.style.border = "2px solid white";

    rouletteWheel.appendChild(wheelBackground);

    // Add icons on top of the colored wheel
    const iconsContainer = document.createElement("div");
    iconsContainer.style.position = "absolute";
    iconsContainer.style.width = "100%";
    iconsContainer.style.height = "100%";
    iconsContainer.style.borderRadius = "50%";

    // Calculate radius based on wheel size
    const wheelSize = Math.min(
      rouletteWheel.offsetWidth,
      rouletteWheel.offsetHeight
    );
    const radius = wheelSize * 0.37; // Adjust radius based on wheel size

    sdgData.forEach((goal, index) => {
      const iconWrapper = document.createElement("div");
      iconWrapper.style.position = "absolute";
      iconWrapper.style.top = "50%";
      iconWrapper.style.left = "50%";

      // Calculate position on the circle
      const angle = index * segmentAngle + segmentAngle / 2;
      const x =
        Math.cos(((angle - 90) * Math.PI) / 180) * radius - iconSize / 2;
      const y =
        Math.sin(((angle - 90) * Math.PI) / 180) * radius - iconSize / 2;

      iconWrapper.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;

      const icon = document.createElement("img");
      icon.src = goal.icon;
      icon.alt = goal.name;
      icon.style.width = `${iconSize}px`;
      icon.style.height = `${iconSize}px`;
      icon.style.objectFit = "contain";

      // Add error handling for icon loading
      icon.onerror = function () {
        // Replace with a text fallback if image fails to load
        const textFallback = document.createElement("div");
        textFallback.textContent = goal.id;
        textFallback.style.width = `${iconSize}px`;
        textFallback.style.height = `${iconSize}px`;
        textFallback.style.backgroundColor = goal.color;
        textFallback.style.color = "#fff";
        textFallback.style.borderRadius = "50%";
        textFallback.style.display = "flex";
        textFallback.style.alignItems = "center";
        textFallback.style.justifyContent = "center";
        textFallback.style.fontWeight = "bold";
        textFallback.style.fontSize = `${iconSize / 2}px`;
        iconWrapper.replaceChild(textFallback, icon);
      };

      iconWrapper.appendChild(icon);
      iconsContainer.appendChild(iconWrapper);
    });

    rouletteWheel.appendChild(iconsContainer);
  }

  // Start dragging the lever
  function startDrag(e) {
    isDragging = true;
    startY = e.clientY;
    lever.style.cursor = "grabbing";
    // Remove transition during dragging for immediate response
    lever.style.transition = "none";
    e.preventDefault();

    // Add a class to prevent scrolling on mobile
    document.body.classList.add("dragging");
  }

  // Start dragging for touch devices
  function startDragTouch(e) {
    isDragging = true;
    startY = e.touches[0].clientY;
    // Remove transition during dragging for immediate response
    lever.style.transition = "none";
    e.preventDefault();

    // Add a class to prevent scrolling on mobile
    document.body.classList.add("dragging");
  }

  // Drag the lever
  function drag(e) {
    if (!isDragging || isSpinning) return;

    const currentY = e.clientY;
    const diff = startY - currentY;

    // Adjust sensitivity based on screen size
    const sensitivityFactor = window.innerWidth < 768 ? 1.5 : 2;

    // Limit the lever rotation
    const rotation = Math.min(Math.max(diff / sensitivityFactor, 0), 90);

    // Update lever position
    lever.style.transform = `translateX(-50%) rotate(-${rotation}deg)`;

    // Update power level (0-100%)
    power = Math.round((rotation / 90) * 100);
    powerLevel.style.width = `${power}%`;
    powerValue.textContent = power;
  }

  // Drag for touch devices
  function dragTouch(e) {
    if (!isDragging || isSpinning) return;

    const currentY = e.touches[0].clientY;
    const diff = startY - currentY;

    // Adjust sensitivity based on screen size
    const sensitivityFactor = window.innerWidth < 768 ? 1.5 : 2;

    // Limit the lever rotation
    const rotation = Math.min(Math.max(diff / sensitivityFactor, 0), 90);

    // Update lever position
    lever.style.transform = `translateX(-50%) rotate(-${rotation}deg)`;

    // Update power level (0-100%)
    power = Math.round((rotation / 90) * 100);
    powerLevel.style.width = `${power}%`;
    powerValue.textContent = power;

    // Prevent default to avoid scrolling while dragging
    e.preventDefault();
  }

  // End dragging and spin the wheel
  function endDrag() {
    if (!isDragging || isSpinning) return;

    isDragging = false;
    lever.style.cursor = "grab";

    // Remove the dragging class
    document.body.classList.remove("dragging");

    // Reset lever position with animation
    lever.style.transition = "transform 0.5s ease";
    lever.style.transform = "translateX(-50%) rotate(0deg)";

    // Spin the wheel based on power
    spinWheel();

    // Reset power after a delay
    setTimeout(() => {
      powerLevel.style.width = "0%";
      powerValue.textContent = "0";
      power = 0;
    }, 1000);

    // Remove transition after animation completes
    setTimeout(() => {
      lever.style.transition = "";
    }, 500);
  }

  // Spin the wheel
  function spinWheel() {
    if (isSpinning) return;

    isSpinning = true;

    const fluctuation = -5 + Math.random() * 10;

    // Calculate spin parameters based on power
    const minSpins = 6 + fluctuation;
    const maxSpins = 1700 + fluctuation;
    const spins = minSpins + (power / 100) * (maxSpins - minSpins);

    // Calculate total rotation (current + new spins)
    const targetRotation = currentRotation + Math.round(spins) * segmentAngle;

    // Calculate duration based on power (faster with more power)
    const minDuration = 3;
    const maxDuration = 8;
    const duration = maxDuration - (power / 100) * (maxDuration - minDuration);

    // Set transition for smooth spinning
    rouletteWheel.style.transition = `transform ${duration}s cubic-bezier(0.1, 0.7, 0.1, 1)`;
    rouletteWheel.style.transform = `rotate(${targetRotation}deg)`;

    // Update current rotation
    currentRotation = targetRotation;

    // After spinning completes
    clearTimeout(spinTimeout);
    spinTimeout = setTimeout(() => {
      isSpinning = false;

      // Calculate which segment is selected
      const segmentAngle = 360 / sdgData.length;
      const normalizedRotation = currentRotation % 360;
      const selectedIndex =
        Math.floor(normalizedRotation / segmentAngle) % sdgData.length;
      const selected =
        sdgData[(sdgData.length - selectedIndex - 1) % sdgData.length];

      // Update result display
      selectedGoal.textContent = selected.name;

      // Responsive result display
      const isMobile = window.innerWidth < 768;
      const imgSize = isMobile ? "40px" : "60px";
      const fontSize = isMobile ? "1rem" : "1.2rem";

      goalDescription.innerHTML = `
                <div style="display: flex; align-items: center; margin-bottom: 15px; flex-wrap: wrap;">
                    <img src="${selected.icon}" alt="${selected.name}" style="width: ${imgSize}; height: ${imgSize}; margin-right: 15px;" onerror="this.outerHTML='<div style=\'width: ${imgSize}; height: ${imgSize}; background-color: ${selected.color}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;\'>${selected.id}</div>'">
                    <h3 style="color: ${selected.color}; font-size: ${fontSize};">Goal ${selected.id}: ${selected.name}</h3>
                </div>
                <p>${selected.description}</p>
            `;

      // Remove transition for instant rotation changes
      setTimeout(() => {
        rouletteWheel.style.transition = "";
      }, 100);
    }, duration * 1000);
  }
});
