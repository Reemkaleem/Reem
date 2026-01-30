# 🚀 Enhanced 3D GitHub Profile Viewer

An immersive, interactive 3D profile viewer that showcases your GitHub profile with stunning visual effects, floating repositories, skill badges, and dynamic lighting.

![WebGL](https://img.shields.io/badge/WebGL-Powered-brightgreen)
![Three.js](https://img.shields.io/badge/Three.js-r128-blue)
![License](https://img.shields.io/badge/license-MIT-orange)

## ✨ Features

### 🎨 Visual Effects
- **Multi-layer Particle System** - Three different particle layers with varying colors, sizes, and movement speeds
- **Dynamic Lighting** - Multiple colored lights that move and pulse, including mouse-following spotlight
- **Holographic Elements** - Glowing corner spheres and floating rings around the main card
- **Advanced Materials** - Metallic, reflective surfaces with emissive glows

### 🎮 Interactive Elements
- **Drag to Rotate** - Click and drag to rotate the 3D card in any direction
- **Scroll to Zoom** - Use mouse wheel to zoom in/out
- **Hover Effects** - Card scales up and info overlay appears on hover
- **Smooth Animations** - Interpolated rotations for buttery-smooth movement

### 📊 Dynamic Content
- **Repository Cards** - Your top 6 most recently updated repos float around the scene
- **Skill Badges** - 3D cylindrical badges showcasing your tech stack
- **Live GitHub Data** - Real-time stats: repos, followers, following
- **Profile Information** - Avatar, bio, and direct link to your GitHub

### 🎯 Advanced Features
- **Auto-rotation** - Card rotates automatically when not being dragged
- **Pulsing effects** - Rings and particles with opacity animations
- **Orbiting elements** - Corner spheres orbit their positions
- **Responsive design** - Works on desktop and mobile devices
- **Performance optimized** - Efficient rendering with configurable particle counts

## 🛠️ Installation

1. **Clone or download** this repository
2. **Open** `main.js` and change the `GITHUB_USERNAME` to your GitHub username:
   ```javascript
   GITHUB_USERNAME: 'YourGitHubUsername'
   ```
3. **Open** `index.html` in a modern web browser
4. **Enjoy** your 3D profile!

## ⚙️ Configuration

Edit these values in `main.js` to customize:

```javascript
const CONFIG = {
    GITHUB_USERNAME: 'Reemkaleem',      // Your GitHub username
    AUTO_ROTATE_SPEED: 0.003,           // Rotation speed (0.001-0.01)
    
    COLORS: {
        primary: 0x00d4ff,              // Cyan
        secondary: 0x7b2cbf,            // Purple
        accent: 0xff006e,               // Pink
        gold: 0xffd700,                 // Gold
        cardFront: 0x1e293b,            // Dark slate
        cardBack: 0x0f172a,             // Darker slate
        particles: 0x00d4ff             // Particle color
    },
    
    PARTICLE_COUNT: 2000,               // More = prettier, slower
    ENABLE_SHADOWS: true,               // Toggle shadows
    ENABLE_REPO_CARDS: true,            // Show floating repos
    ENABLE_SKILL_BADGES: true,          // Show skill badges
    MAX_REPOS_DISPLAY: 6                // Number of repos to show
};
```

### Color Customization

Edit CSS variables in `styles.css`:

```css
:root {
    --primary-color: #00d4ff;
    --secondary-color: #7b2cbf;
    --accent-color: #ff006e;
    --background-dark: #0a0e27;
}
```

## 🎯 Skill Badges

Customize your skills in `main.js` (look for `createSkillBadges` function):

```javascript
const skills = [
    { name: 'JavaScript', color: 0xf7df1e, y: 6 },
    { name: 'Python', color: 0x3776ab, y: 5 },
    { name: 'React', color: 0x61dafb, y: 4 },
    // Add your own!
];
```

## 📱 Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ⚠️ IE not supported (requires WebGL 2.0)

## 🚀 Performance Tips

If experiencing lag:
1. Reduce `PARTICLE_COUNT` to 1000 or 500
2. Set `ENABLE_SHADOWS` to `false`
3. Reduce `MAX_REPOS_DISPLAY` to 3
4. Close other browser tabs/apps

## 📚 Technologies Used

- **Three.js** - 3D graphics library
- **GitHub API** - Fetching profile data
- **WebGL** - Hardware-accelerated rendering
- **CSS3** - Animations and effects
- **JavaScript ES6+** - Modern async/await patterns

## 🎨 Animation Details

### Main Card
- Auto-rotates on Y-axis
- Scales up 15% on hover
- Smooth lerp interpolation for all rotations

### Floating Rings (4 layers)
- Individual rotation speeds
- Vertical floating motion
- Pulsing opacity

### Particles (3 layers)
- Different colors per layer
- Boundary wrapping
- Velocity-based movement

### Repository Cards
- Orbital motion around center
- Look-at camera orientation
- Scale pulsing
- Vertical wave motion

### Skill Badges
- Floating animation
- Continuous Y-axis rotation
- Staggered vertical positions

### Lighting
- Main light orbits the scene
- Pulsing intensity
- Mouse-following spotlight
- Multiple accent lights

## 🔧 Troubleshooting

**Profile not loading?**
- Check your GitHub username in `CONFIG.GITHUB_USERNAME`
- Ensure internet connection (needs GitHub API access)
- Open browser console (F12) for error messages

**Performance issues?**
- Lower particle count
- Disable shadows
- Reduce number of repo cards

**Not interactive?**
- Ensure JavaScript is enabled
- Try a different browser
- Check if WebGL is supported

## 📄 License

MIT License - feel free to use, modify, and share!

## 🌟 Credits

Created with ❤️ using Three.js and creativity!

## 🤝 Contributing

Feel free to fork, enhance, and create pull requests!

Ideas for enhancements:
- Add more animations
- Custom shaders
- VR support
- More GitHub stats
- Social media integration
- Theme switcher

---

**Made with Three.js, WebGL, and lots of particles! ✨**
