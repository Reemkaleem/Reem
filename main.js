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
    
    PARTICLE_COUNT: 2000,
    ENABLE_SHADOWS: true,
    ENABLE_BLOOM: true,
    ENABLE_REPO_CARDS: true,
    ENABLE_SKILL_BADGES: true,
    MAX_REPOS_DISPLAY: 6
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
        { color: CONFIG.COLORS.primary, size: 0.15, count: CONFIG.PARTICLE_COUNT * 0.5, speed: 0.0002 },
        { color: CONFIG.COLORS.secondary, size: 0.1, count: CONFIG.PARTICLE_COUNT * 0.3, speed: 0.0003 },
        { color: CONFIG.COLORS.accent, size: 0.08, count: CONFIG.PARTICLE_COUNT * 0.2, speed: 0.00015 }
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
    card.add(cardMesh);
    
    // Glowing edges
    const edgeGeometry = new THREE.EdgesGeometry(cardGeometry);
    const edgeMaterial = new THREE.LineBasicMaterial({ 
        color: CONFIG.COLORS.primary,
        transparent: true,
        opacity: 0.8
    });
    const wireframe = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    card.add(wireframe);
    
    createFloatingRings();
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
            
            miniCard.userData = {
                orbitSpeed: 0.0005,
                angle: angle,
                radius: radius,
                verticalOffset: Math.sin(i * 0.5) * 2,
                repoName: repo.name,
                stars: repo.stargazers_count
            };
            
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
        { name: 'JavaScript', color: 0xf7df1e, y: 6 },
        { name: 'Python', color: 0x3776ab, y: 5 },
        { name: 'React', color: 0x61dafb, y: 4 },
        { name: 'Node.js', color: 0x339933, y: 3 },
        { name: 'Three.js', color: 0x000000, y: 2 }
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
        badge.position.set(-6 + i * 1.5, skill.y, -5);
        badge.rotation.z = Math.PI / 2;
        badge.userData = {
            floatSpeed: 0.001 + i * 0.0002,
            floatRange: 0.3,
            originalY: skill.y,
            rotationSpeed: 0.01
        };
        
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
    pointLight.shadow.mapSize.width = 2048;
    pointLight.shadow.mapSize.height = 2048;
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
        }
    });
    
    canvas.addEventListener('mouseup', () => {
        isDragging = false;
        canvas.style.cursor = 'grab';
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
   ANIMATION LOOP 🎬
   ======================================== */

function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
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
        system.rotation.x += system.geometry.userData.speed * 0.5;
        
        const positions = system.geometry.attributes.position.array;
        const velocities = system.geometry.userData.velocities;
        
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += velocities[i] * 0.1;
            positions[i + 1] += velocities[i + 1] * 0.1;
            positions[i + 2] += velocities[i + 2] * 0.1;
            
            if (Math.abs(positions[i]) > 50) positions[i] *= -1;
            if (Math.abs(positions[i + 1]) > 50) positions[i + 1] *= -1;
            if (Math.abs(positions[i + 2]) > 50) positions[i + 2] *= -1;
        }
        
        system.geometry.attributes.position.needsUpdate = true;
    });
    
    // Animate repo cards
    repoCards.forEach(repoCard => {
        repoCard.userData.angle += repoCard.userData.orbitSpeed;
        repoCard.position.x = Math.cos(repoCard.userData.angle) * repoCard.userData.radius;
        repoCard.position.z = Math.sin(repoCard.userData.angle) * repoCard.userData.radius;
        repoCard.position.y = repoCard.userData.verticalOffset + Math.sin(time + repoCard.userData.angle) * 0.5;
        repoCard.lookAt(0, repoCard.position.y, 0);
        
        const scale = 1 + Math.sin(time * 2 + repoCard.userData.angle) * 0.05;
        repoCard.scale.set(scale, scale, scale);
    });
    
    // Animate skill badges
    skillBadges.forEach(badge => {
        badge.position.y = badge.userData.originalY + Math.sin(time * badge.userData.floatSpeed * 100) * badge.userData.floatRange;
        badge.rotation.y += badge.userData.rotationSpeed;
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
