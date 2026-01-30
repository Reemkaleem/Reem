/* ========================================
   🚀 ENHANCED 3D PROFILE VIEWER
   Creative Features: Multi-layer particles, floating repos, 
   skill badges, dynamic lighting, smooth animations
   ======================================== */

// 🔧 Configuration Options
const CONFIG = {
    GITHUB_USERNAME: 'Reemkaleem',
    AUTO_ROTATE_SPEED: 0.003,
    
    COLORS: {
        primary: 0x00d4ff,
        secondary: 0x7b2cbf,
        accent: 0xff006e,
        gold: 0xffd700,
        cardFront: 0x1e293b,
        cardBack: 0x0f172a,
        particles: 0x00d4ff
    },
    
    PARTICLE_COUNT: 300,
    ENABLE_SHADOWS: false,
    ENABLE_BLOOM: false,
    ENABLE_REPO_CARDS: true,
    ENABLE_SKILL_BADGES: true,
    MAX_REPOS_DISPLAY: 4,
    PROXIMITY_THRESHOLD: 6.5
};

// 🎯 Tech Stack Configuration
const TECH_STACK = {
    mainCard: {
        title: 'GitHub Profile',
        tech: ['Three.js', 'WebGL', 'JavaScript ES6+', 'GitHub API', 'CSS3 Animations', 'Python', 'Machine Learning']
    },
    
    // Repository-specific tech stacks
    repositories: {
        'loan-eligibility-prediction': {
            title: 'Loan Eligibility Prediction System',
            tech: ['Python', 'Flask', 'Supabase', 'Random Forest', 'XGBoost', 'Deepchecks', 'Docker', 'PostgreSQL']
        },
        'StreeRaksha': {
            title: 'StreeRaksha - Women Safety System',
            tech: ['Python', 'YOLOv5', 'DeepSORT', 'FastAPI', 'Firebase', 'Supabase', 'OpenCV', 'Redis']
        },
        'lung-disease-classification': {
            title: 'Lung Disease Classification',
            tech: ['Python', 'TensorFlow', 'Keras', 'VGG-19', 'CNN', 'Deep Learning', 'Medical AI']
        },
        'Reem': {
            title: '3D Profile Viewer',
            tech: ['Three.js', 'WebGL', 'JavaScript', 'CSS3', 'GitHub API']
        }
    },
    
    // Skill-specific tech details
    skills: {
        'JavaScript': ['ES6+', 'Three.js', 'WebGL', 'Node.js', 'DOM Manipulation', 'Async/Await'],
        'Python': ['Flask', 'FastAPI', 'TensorFlow', 'Keras', 'OpenCV', 'Scikit-learn', 'Pandas', 'NumPy'],
        'React': ['Hooks', 'State Management', 'Component Design', 'REST APIs', 'Modern UI/UX'],
        'Node.js': ['Express', 'FastAPI', 'REST APIs', 'WebSockets', 'Microservices'],
        'Three.js': ['WebGL', '3D Graphics', 'Animations', 'Materials', 'Lighting', 'Particle Systems'],
        'Machine Learning': ['Random Forest', 'XGBoost', 'CNN', 'Transfer Learning', 'Model Deployment', 'Deepchecks'],
        'Databases': ['PostgreSQL', 'Supabase', 'Firebase', 'MySQL', 'MongoDB', 'Redis'],
        'DevOps': ['Docker', 'Git', 'GitHub', 'CI/CD', 'Deployment'],
        'Computer Vision': ['YOLOv5', 'DeepSORT', 'OpenCV', 'Object Detection', 'Tracking'],
        'Deep Learning': ['TensorFlow', 'Keras', 'VGG-19', 'CNN', 'Transfer Learning', 'Model Training']
    }
};

/* ========================================
   GLOBAL VARIABLES
   ======================================== */

let scene, camera, renderer;
let card, pointLight, ambientLight;
let isMouseOver = false;
let repoCards = [];
let skillBadges = [];
let particleSystems = [];
let mouse = { x: 0, y: 0 };
let dynamicLight;
let githubData = null;

// Proximity detection variables
let nearObject = null;
let lastNearObject = null;
let proximityDebounceTimer = null;
let interactiveObjects = [];
let raycaster = new THREE.Raycaster();
let clickedObject = null;
let hoveredObject = null;

/* ========================================
   SCENE SETUP
   ======================================== */

function initScene() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0e27, 0.0005);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;
    
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = CONFIG.ENABLE_SHADOWS;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    document.getElementById('canvas-container').appendChild(renderer.domElement);
}

/* ========================================
   MULTI-LAYER PARTICLE SYSTEM ✨
   ======================================== */

function createEnhancedParticles() {
    const layers = [
        { color: CONFIG.COLORS.primary, size: 0.15, count: CONFIG.PARTICLE_COUNT * 0.6, speed: 0.0002 },
        { color: CONFIG.COLORS.secondary, size: 0.1, count: CONFIG.PARTICLE_COUNT * 0.4, speed: 0.0003 }
    ];
    
    layers.forEach((layer) => {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(layer.count * 3);
        const velocities = new Float32Array(layer.count * 3);
        
        for (let i = 0; i < layer.count; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 100;
            positions[i3 + 1] = (Math.random() - 0.5) * 100;
            positions[i3 + 2] = (Math.random() - 0.5) * 100;
            
            velocities[i3] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.userData.velocities = velocities;
        geometry.userData.speed = layer.speed;
        
        const material = new THREE.PointsMaterial({
            color: layer.color,
            size: layer.size,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        const particleSystem = new THREE.Points(geometry, material);
        particleSystems.push(particleSystem);
        scene.add(particleSystem);
    });
}

/* ========================================
   ENHANCED 3D CARD 🎴
   ======================================== */

function createEnhancedCard() {
    card = new THREE.Group();
    
    const cardWidth = 3.5;
    const cardHeight = 4.5;
    const cardDepth = 0.15;
    const cardGeometry = new THREE.BoxGeometry(cardWidth, cardHeight, cardDepth);
    
    const materials = [
        new THREE.MeshStandardMaterial({ color: CONFIG.COLORS.primary, metalness: 0.5, roughness: 0.3 }),
        new THREE.MeshStandardMaterial({ color: CONFIG.COLORS.primary, metalness: 0.5, roughness: 0.3 }),
        new THREE.MeshStandardMaterial({ color: CONFIG.COLORS.primary, metalness: 0.5, roughness: 0.3 }),
        new THREE.MeshStandardMaterial({ color: CONFIG.COLORS.primary, metalness: 0.5, roughness: 0.3 }),
        new THREE.MeshStandardMaterial({ 
            color: CONFIG.COLORS.cardFront, 
            metalness: 0.7, 
            roughness: 0.2,
            emissive: CONFIG.COLORS.primary,
            emissiveIntensity: 0.1
        }),
        new THREE.MeshStandardMaterial({ color: CONFIG.COLORS.cardBack, metalness: 0.7, roughness: 0.2 })
    ];
    
    const cardMesh = new THREE.Mesh(cardGeometry, materials);
    cardMesh.castShadow = CONFIG.ENABLE_SHADOWS;
    cardMesh.receiveShadow = CONFIG.ENABLE_SHADOWS;
    
    // Attach tech stack metadata
    cardMesh.userData.tech = TECH_STACK.mainCard.tech;
    cardMesh.userData.title = TECH_STACK.mainCard.title;
    cardMesh.userData.type = 'mainCard';
    cardMesh.userData.baseEmissive = CONFIG.COLORS.primary;
    cardMesh.userData.baseEmissiveIntensity = 0.1;
    
    card.add(cardMesh);
    interactiveObjects.push(cardMesh);
    
    // Glowing edges
    const edgeGeometry = new THREE.EdgesGeometry(cardGeometry);
    const edgeMaterial = new THREE.LineBasicMaterial({ 
        color: CONFIG.COLORS.primary,
        transparent: true,
        opacity: 0.8
    });
    const wireframe = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    card.add(wireframe);
    
    createHolographicCorners();
    
    scene.add(card);
}

/* ========================================
   FLOATING RINGS 💫
   ======================================== */

function createFloatingRings() {
    const ringCount = 4;
    for (let i = 0; i < ringCount; i++) {
        const ringGeometry = new THREE.TorusGeometry(2.8 + i * 0.35, 0.03, 16, 100);
        const ringMaterial = new THREE.MeshStandardMaterial({ 
            color: i % 2 === 0 ? CONFIG.COLORS.secondary : CONFIG.COLORS.accent,
            transparent: true,
            opacity: 0.4 - i * 0.08,
            emissive: i % 2 === 0 ? CONFIG.COLORS.secondary : CONFIG.COLORS.accent,
            emissiveIntensity: 0.3,
            metalness: 0.8,
            roughness: 0.2
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.position.z = -0.5 - i * 0.1;
        ring.userData = { 
            rotationSpeed: 0.001 + i * 0.0003,
            index: i,
            baseOpacity: 0.4 - i * 0.08
        };
        card.add(ring);
    }
}

/* ========================================
   HOLOGRAPHIC CORNERS ⭐
   ======================================== */

function createHolographicCorners() {
    const positions = [
        [-1.8, 2.3, 0.3], [1.8, 2.3, 0.3],
        [-1.8, -2.3, 0.3], [1.8, -2.3, 0.3]
    ];
    
    positions.forEach((pos, i) => {
        const sphereGeometry = new THREE.SphereGeometry(0.12, 32, 32);
        const sphereMaterial = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.gold,
            emissive: CONFIG.COLORS.gold,
            emissiveIntensity: 0.8,
            metalness: 1,
            roughness: 0,
            transparent: true,
            opacity: 0.9
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(...pos);
        sphere.userData = { 
            orbitSpeed: 0.002 + i * 0.0005,
            orbitRadius: 0.1,
            originalPos: pos.slice()
        };
        card.add(sphere);
    });
}

/* ========================================
   FLOATING REPOSITORY CARDS 📦
   ======================================== */

async function createRepoCards() {
    if (!CONFIG.ENABLE_REPO_CARDS || !githubData) return;
    
    try {
        const response = await fetch(`https://api.github.com/users/${CONFIG.GITHUB_USERNAME}/repos?sort=updated&per_page=${CONFIG.MAX_REPOS_DISPLAY}`);
        const repos = await response.json();
        
        const angleStep = (Math.PI * 2) / Math.min(repos.length, CONFIG.MAX_REPOS_DISPLAY);
        const radius = 12;
        
        repos.slice(0, CONFIG.MAX_REPOS_DISPLAY).forEach((repo, i) => {
            const angle = i * angleStep;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            const miniCardGeometry = new THREE.BoxGeometry(1.5, 1.2, 0.08);
            const miniCardMaterial = new THREE.MeshStandardMaterial({
                color: CONFIG.COLORS.cardFront,
                metalness: 0.5,
                roughness: 0.3,
                emissive: CONFIG.COLORS.secondary,
                emissiveIntensity: 0.2
            });
            
            const miniCard = new THREE.Mesh(miniCardGeometry, miniCardMaterial);
            miniCard.position.set(x, Math.sin(i * 0.5) * 2, z);
            miniCard.lookAt(0, miniCard.position.y, 0);
            miniCard.castShadow = true;
            
            const edgeGeo = new THREE.EdgesGeometry(miniCardGeometry);
            const edgeMat = new THREE.LineBasicMaterial({ 
                color: CONFIG.COLORS.accent,
                transparent: true,
                opacity: 0.6
            });
            const edges = new THREE.LineSegments(edgeGeo, edgeMat);
            miniCard.add(edges);
            
            // Determine tech stack - use predefined or auto-detect
            const repoKey = repo.name.toLowerCase();
            let repoTech, repoTitle;
            
            if (TECH_STACK.repositories[repoKey]) {
                repoTech = TECH_STACK.repositories[repoKey].tech;
                repoTitle = TECH_STACK.repositories[repoKey].title;
            } else if (TECH_STACK.repositories[repo.name]) {
                repoTech = TECH_STACK.repositories[repo.name].tech;
                repoTitle = TECH_STACK.repositories[repo.name].title;
            } else {
                repoTech = repo.language ? 
                    [repo.language, 'Git', 'GitHub', ...(repo.topics || []).slice(0, 3)] :
                    ['Git', 'GitHub', 'Open Source'];
                repoTitle = repo.name;
            }
            
            miniCard.userData = {
                orbitSpeed: 0.0005,
                angle: angle,
                radius: radius,
                verticalOffset: Math.sin(i * 0.5) * 2,
                repoName: repo.name,
                stars: repo.stargazers_count,
                tech: repoTech,
                title: repoTitle,
                type: 'repository',
                baseEmissive: CONFIG.COLORS.secondary,
                baseEmissiveIntensity: 0.2
            };
            
            interactiveObjects.push(miniCard);
            
            repoCards.push(miniCard);
            scene.add(miniCard);
        });
    } catch (error) {
        console.error('Error fetching repos:', error);
    }
}

/* ========================================
   3D SKILL BADGES 🎯
   ======================================== */

function createSkillBadges() {
    if (!CONFIG.ENABLE_SKILL_BADGES) return;
    
    const skills = [
        { name: 'Python', color: 0x3776ab, x: -8, y: 6, z: -3 },
        { name: 'Machine Learning', color: 0xff6f00, x: -6, y: 4, z: -6 },
        { name: 'Deep Learning', color: 0x00bcd4, x: -9, y: 2, z: -4 },
        { name: 'JavaScript', color: 0xf7df1e, x: -6, y: 6.5, z: -4 }
    ];
    
    skills.forEach((skill, i) => {
        const badgeGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32);
        const badgeMaterial = new THREE.MeshStandardMaterial({
            color: skill.color,
            metalness: 0.8,
            roughness: 0.2,
            emissive: skill.color,
            emissiveIntensity: 0.3
        });
        
        const badge = new THREE.Mesh(badgeGeometry, badgeMaterial);
        badge.position.set(skill.x, skill.y, skill.z);
        badge.rotation.z = Math.PI / 2;
        badge.userData = {
            floatSpeed: 0.001 + i * 0.0002,
            floatRange: 0.3,
            originalY: skill.y,
            rotationSpeed: 0.01,
            tech: TECH_STACK.skills[skill.name] || [skill.name],
            title: skill.name,
            type: 'skill',
            baseEmissive: skill.color,
            baseEmissiveIntensity: 0.3
        };
        
        interactiveObjects.push(badge);
        skillBadges.push(badge);
        scene.add(badge);
    });
}

/* ========================================
   DYNAMIC LIGHTING 💡
   ======================================== */

function createDynamicLights() {
    ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    pointLight = new THREE.PointLight(CONFIG.COLORS.primary, 2, 100);
    pointLight.position.set(5, 5, 5);
    pointLight.castShadow = CONFIG.ENABLE_SHADOWS;
    pointLight.shadow.mapSize.width = 512;
    pointLight.shadow.mapSize.height = 512;
    scene.add(pointLight);
    
    const accentLight1 = new THREE.PointLight(CONFIG.COLORS.accent, 1.5, 50);
    accentLight1.position.set(-5, -3, 5);
    scene.add(accentLight1);
    
    const accentLight2 = new THREE.PointLight(CONFIG.COLORS.secondary, 1.5, 50);
    accentLight2.position.set(5, -3, -5);
    scene.add(accentLight2);
    
    dynamicLight = new THREE.PointLight(CONFIG.COLORS.gold, 1, 20);
    dynamicLight.position.set(0, 0, 5);
    scene.add(dynamicLight);
}

/* ========================================
   MOUSE CONTROLS 🖱️
   ======================================== */

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let targetRotation = { x: 0, y: 0 };
let currentRotation = { x: 0, y: 0 };
let hoverTimeout = null;

function setupMouseControls() {
    const canvas = renderer.domElement;
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        
        if (dynamicLight) {
            dynamicLight.position.x = mouse.x * 10;
            dynamicLight.position.y = mouse.y * 10;
        }
    });
    
    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
        canvas.style.cursor = 'grabbing';
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;
            
            targetRotation.y += deltaX * 0.01;
            targetRotation.x += deltaY * 0.01;
            
            previousMousePosition = { x: e.clientX, y: e.clientY };
        } else {
            // Check hover on floating objects
            const rect = canvas.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera({ x, y }, camera);
            
            const floatingObjects = interactiveObjects.filter(obj => obj.userData.type !== 'mainCard');
            const intersects = raycaster.intersectObjects(floatingObjects, true);
            
            if (intersects.length > 0) {
                let hovered = intersects[0].object;
                while (hovered.parent && !hovered.userData.tech) {
                    hovered = hovered.parent;
                }
                hoveredObject = hovered.userData.tech ? hovered : null;
                canvas.style.cursor = hoveredObject ? 'pointer' : 'grab';
            } else {
                hoveredObject = null;
                canvas.style.cursor = isDragging ? 'grabbing' : 'grab';
            }
        }
    });
    
    canvas.addEventListener('mouseup', () => {
        isDragging = false;
        canvas.style.cursor = 'grab';
    });
    
    // Click detection for floating objects
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera({ x, y }, camera);
        
        // Only check floating repos and skill badges
        const floatingObjects = interactiveObjects.filter(obj => obj.userData.type !== 'mainCard');
        const intersects = raycaster.intersectObjects(floatingObjects, true);
        
        if (intersects.length > 0) {
            // Find the parent object
            let clicked = intersects[0].object;
            while (clicked.parent && !clicked.userData.tech) {
                clicked = clicked.parent;
            }
            
            if (clicked.userData.tech) {
                clickedObject = clicked;
                updateTechStackOverlay();
            }
        } else {
            clickedObject = null;
            updateTechStackOverlay();
        }
    });
    
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        camera.position.z += e.deltaY * 0.01;
        camera.position.z = Math.max(4, Math.min(15, camera.position.z));
    }, { passive: false });
    
    // Fixed hover detection - only trigger on card area
    document.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Check if mouse is near center (where card is)
        const distance = Math.sqrt(
            Math.pow(mouseX - centerX, 2) + 
            Math.pow(mouseY - centerY, 2)
        );
        
        const cardRadius = Math.min(rect.width, rect.height) * 0.25;
        
        if (distance < cardRadius && !isMouseOver) {
            clearTimeout(hoverTimeout);
            hoverTimeout = setTimeout(() => {
                isMouseOver = true;
                showOverlay();
            }, 100);
        } else if (distance > cardRadius * 1.5 && isMouseOver) {
            clearTimeout(hoverTimeout);
            hoverTimeout = setTimeout(() => {
                isMouseOver = false;
                hideOverlay();
            }, 100);
        }
    });
}

/* ========================================
   OVERLAY CONTROLS
   ======================================== */

function showOverlay() {
    const overlay = document.getElementById('profile-overlay');
    overlay.classList.remove('hidden');
    overlay.classList.add('visible');
}

function hideOverlay() {
    const overlay = document.getElementById('profile-overlay');
    overlay.classList.remove('visible');
    setTimeout(() => overlay.classList.add('hidden'), 300);
}

/* ========================================
   GITHUB DATA FETCHING
   ======================================== */

async function fetchGitHubProfile() {
    try {
        const response = await fetch(`https://api.github.com/users/${CONFIG.GITHUB_USERNAME}`);
        
        if (!response.ok) {
            throw new Error(`User not found: ${CONFIG.GITHUB_USERNAME}`);
        }
        
        githubData = await response.json();
        updateProfileDisplay(githubData);
        await createRepoCards();
        createSkillBadges();
        hideLoading();
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loading').querySelector('p').textContent = `Error: ${error.message}`;
    }
}

function updateProfileDisplay(data) {
    document.getElementById('avatar').src = data.avatar_url;
    document.getElementById('username').textContent = data.name || data.login;
    document.getElementById('bio').textContent = data.bio || 'No bio available';
    document.getElementById('repos').textContent = data.public_repos;
    document.getElementById('github-link').href = data.html_url;
}

function hideLoading() {
    setTimeout(() => document.getElementById('loading').classList.add('hidden'), 500);
}

/* ========================================
   PROXIMITY DETECTION SYSTEM 🎯
   ======================================== */

function isNear(object, threshold = CONFIG.PROXIMITY_THRESHOLD) {
    if (!object || !object.position) return false;
    const distance = camera.position.distanceTo(object.position);
    return distance < threshold;
}

function checkProximity() {
    let closest = null;
    let closestDistance = Infinity;
    
    // Only check floating repos and skill badges (not main card)
    interactiveObjects.forEach(obj => {
        if (!obj.position || obj.userData.type === 'mainCard') return;
        const distance = camera.position.distanceTo(obj.position);
        if (distance < CONFIG.PROXIMITY_THRESHOLD && distance < closestDistance) {
            closestDistance = distance;
            closest = obj;
        }
    });
    
    // Debounce to prevent flickering
    if (closest !== lastNearObject) {
        clearTimeout(proximityDebounceTimer);
        proximityDebounceTimer = setTimeout(() => {
            nearObject = closest;
            updateTechStackOverlay();
            updateObjectGlow();
        }, 150);
        lastNearObject = closest;
    }
}

function updateObjectGlow() {
    // Reset all objects to base glow (skip main card)
    interactiveObjects.forEach(obj => {
        if (obj.userData.type === 'mainCard') return;
        
        if (obj.material && obj.material.emissiveIntensity !== undefined) {
            const targetIntensity = obj === nearObject ? 
                (obj.userData.baseEmissiveIntensity || 0.2) * 2.5 : 
                (obj.userData.baseEmissiveIntensity || 0.2);
            
            if (Array.isArray(obj.material)) {
                obj.material.forEach(mat => {
                    if (mat.emissiveIntensity !== undefined) {
                        mat.emissiveIntensity += (targetIntensity - mat.emissiveIntensity) * 0.1;
                    }
                });
            } else {
                obj.material.emissiveIntensity += (targetIntensity - obj.material.emissiveIntensity) * 0.1;
            }
        }
    });
}

function updateTechStackOverlay() {
    const overlay = document.getElementById('tech-stack-overlay');
    const titleEl = document.getElementById('tech-title');
    const chipsContainer = document.getElementById('tech-chips');
    
    if (!overlay || !titleEl || !chipsContainer) return;
    
    if (clickedObject && clickedObject.userData.tech) {
        // Show overlay with object type icon
        const icon = clickedObject.userData.type === 'repository' ? '📦' : 
                     clickedObject.userData.type === 'skill' ? '🎯' : '✨';
        titleEl.innerHTML = `${icon} ${clickedObject.userData.title || 'Technology Stack'}`;
        
        // Add stars if it's a repo
        if (clickedObject.userData.stars !== undefined) {
            titleEl.innerHTML += ` <span style="color: #ffd700; font-size: 14px;">⭐ ${clickedObject.userData.stars}</span>`;
        }
        
        // Clear and populate chips
        chipsContainer.innerHTML = '';
        clickedObject.userData.tech.forEach((tech, index) => {
            const chip = document.createElement('div');
            chip.className = 'tech-chip';
            chip.textContent = tech;
            chip.style.animationDelay = `${index * 0.05}s`;
            chipsContainer.appendChild(chip);
        });
        
        overlay.classList.add('visible');
        overlay.classList.remove('hidden');
    } else {
        // Hide overlay
        overlay.classList.remove('visible');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }
}

/* ========================================
   ANIMATION LOOP 🎬
   ======================================== */

function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
    // Check proximity to interactive objects
    checkProximity();
    
    // Animate card
    if (card) {
        if (!isDragging) {
            targetRotation.y += CONFIG.AUTO_ROTATE_SPEED;
        }
        
        currentRotation.x += (targetRotation.x - currentRotation.x) * 0.1;
        currentRotation.y += (targetRotation.y - currentRotation.y) * 0.1;
        
        card.rotation.x = currentRotation.x;
        card.rotation.y = currentRotation.y;
        
        card.children.forEach(child => {
            if (child.userData.rotationSpeed) {
                child.rotation.z += child.userData.rotationSpeed;
                child.position.y = Math.sin(time * 2 + child.userData.index) * 0.15;
                
                if (child.material && child.userData.baseOpacity) {
                    child.material.opacity = child.userData.baseOpacity + Math.sin(time * 3 + child.userData.index) * 0.1;
                }
            }
            
            if (child.userData.orbitSpeed && child.userData.originalPos) {
                const [ox, oy, oz] = child.userData.originalPos;
                child.position.x = ox + Math.cos(time * child.userData.orbitSpeed) * child.userData.orbitRadius;
                child.position.z = oz + Math.sin(time * child.userData.orbitSpeed) * child.userData.orbitRadius;
            }
        });
        
        const targetScale = isMouseOver ? 1.15 : 1;
        card.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    
    // Animate particles
    particleSystems.forEach((system) => {
        system.rotation.y += system.geometry.userData.speed;
        // Removed per-particle position updates for performance
    });
    
    // Animate repo cards
    repoCards.forEach(repoCard => {
        repoCard.userData.angle += repoCard.userData.orbitSpeed;
        repoCard.position.x = Math.cos(repoCard.userData.angle) * repoCard.userData.radius;
        repoCard.position.z = Math.sin(repoCard.userData.angle) * repoCard.userData.radius;
        repoCard.position.y = repoCard.userData.verticalOffset + Math.sin(time + repoCard.userData.angle) * 0.5;
        repoCard.lookAt(0, repoCard.position.y, 0);
        
        // Scale effect for hover or click
        const isActive = repoCard === hoveredObject || repoCard === clickedObject;
        const targetScale = isActive ? 1.3 : (1 + Math.sin(time * 2 + repoCard.userData.angle) * 0.05);
        const currentScale = repoCard.scale.x;
        const newScale = currentScale + (targetScale - currentScale) * 0.15;
        repoCard.scale.set(newScale, newScale, newScale);
    });
    
    // Animate skill badges
    skillBadges.forEach(badge => {
        badge.position.y = badge.userData.originalY + Math.sin(time * badge.userData.floatSpeed * 100) * badge.userData.floatRange;
        badge.rotation.y += badge.userData.rotationSpeed;
        
        // Scale effect for hover or click
        const isActive = badge === hoveredObject || badge === clickedObject;
        const targetScale = isActive ? 1.3 : 1;
        const currentScale = badge.scale.x;
        const newScale = currentScale + (targetScale - currentScale) * 0.15;
        badge.scale.set(newScale, newScale, newScale);
    });
    
    // Animate lights
    if (pointLight) {
        pointLight.position.x = Math.sin(time * 0.5) * 8;
        pointLight.position.z = Math.cos(time * 0.5) * 8;
        pointLight.intensity = 2 + Math.sin(time * 2) * 0.3;
    }
    
    renderer.render(scene, camera);
}

/* ========================================
   WINDOW RESIZE
   ======================================== */

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);

/* ========================================
   INITIALIZATION
   ======================================== */

async function init() {
    initScene();
    createEnhancedCard();
    createEnhancedParticles();
    createDynamicLights();
    setupMouseControls();
    await fetchGitHubProfile();
    animate();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

/* ========================================
   CLEANUP
   ======================================== */

window.addEventListener('beforeunload', () => {
    if (renderer) renderer.dispose();
    scene?.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
            if (Array.isArray(object.material)) {
                object.material.forEach(mat => mat.dispose());
            } else {
                object.material.dispose();
            }
        }
    });
});
