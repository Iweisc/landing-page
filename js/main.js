document.addEventListener('DOMContentLoaded', () => {
    // --- CURSOR ---
    const cursor = document.querySelector('.cursor');
    window.addEventListener('mousemove', e => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
    });

    document.querySelectorAll('a, button, .magnetic').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // --- MAGNETIC BUTTONS ---
    const magneticButtons = document.querySelectorAll('.magnetic');
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const {
                offsetX: x,
                offsetY: y
            } = e;
            const {
                offsetWidth: width,
                offsetHeight: height
            } = this;
            const move = 25;
            const xMove = x / width * (move * 2) - move;
            const yMove = y / height * (move * 2) - move;
            gsap.to(this, {
                x: xMove,
                y: yMove,
                duration: 0.5,
                ease: 'power3.out'
            });
        });
        button.addEventListener('mouseleave', function(e) {
            gsap.to(this, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });

    // --- PRELOADER ---
    gsap.to('.preloader', {
        duration: 1.5,
        opacity: 0,
        delay: 1,
        onComplete: () => {
            document.querySelector('.preloader').style.display = 'none';
            gsap.to('.main-content', {
                opacity: 1,
                duration: 1
            });
            // --- HERO HEADLINE ANIMATION ---
            gsap.from('.hero-headline', {
                y: 100,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                delay: 0.2
            });
        }
    });


    // --- THREE.JS HERO BACKGROUND ---
    let scene, camera, renderer, mesh;
    const heroBg = document.getElementById('hero-bg');

    function initThree() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        heroBg.appendChild(renderer.domElement);

        const geometry = new THREE.TorusKnotGeometry(1.5, 0.5, 100, 16);
        const material = new THREE.MeshStandardMaterial({
            color: 0x1D1D1D,
            wireframe: true,
            metalness: 0.8,
            roughness: 0.2
        });
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1).normalize();
        scene.add(light);

        camera.position.z = 5;

        animate();
    }

    function animate() {
        requestAnimationFrame(animate);
        mesh.rotation.x += 0.001;
        mesh.rotation.y += 0.001;
        renderer.render(scene, camera);
    }

    heroBg.addEventListener('mousemove', e => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        gsap.to(mesh.rotation, {
            y: x * 0.5,
            x: y * 0.5,
            duration: 1,
            ease: 'power2.out'
        });
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    initThree();


    // --- GSAP SCROLLTRIGGERS ---
    gsap.registerPlugin(ScrollTrigger);

    // Horizontal scroll for services
    const servicesSection = document.querySelector('.services-section');
    const scrollWrapper = document.querySelector('.horizontal-scroll-wrapper');
    gsap.to(scrollWrapper, {
        x: () => -(scrollWrapper.scrollWidth - servicesSection.offsetWidth),
        ease: 'none',
        scrollTrigger: {
            trigger: servicesSection,
            pin: true,
            scrub: 1,
            end: () => "+=" + scrollWrapper.scrollWidth,
        }
    });

    // Reveal projects on scroll
    gsap.utils.toArray('.project').forEach(project => {
        gsap.from(project, {
            opacity: 0,
            y: 100,
            duration: 1,
            scrollTrigger: {
                trigger: project,
                start: 'top 80%',
            }
        });
    });

    // Timeline animation
    const timelineConnector = document.querySelector('.timeline-connector path');
    const length = timelineConnector.getTotalLength();
    timelineConnector.style.strokeDasharray = length;
    timelineConnector.style.strokeDashoffset = length;
    gsap.to(timelineConnector, {
        strokeDashoffset: 0,
        scrollTrigger: {
            trigger: '.process-section',
            start: 'top center',
            end: 'bottom bottom',
            scrub: 1,
        }
    });

    // Tech stack tooltip
    document.querySelectorAll('.tech-item').forEach(item => {
        const tooltipText = item.getAttribute('data-tooltip');
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        item.appendChild(tooltip);
    });

    // Testimonial slider
    const slider = document.querySelector('.testimonial-slider');
    if (slider) {
        const testimonials = gsap.utils.toArray('.testimonial-card');
        let current = 0;

        // Set initial state
        gsap.set(testimonials, { opacity: 0, position: 'absolute' });
        gsap.set(testimonials[0], { opacity: 1, position: 'relative' });

        function nextTestimonial() {
            // Fade out current
            gsap.to(testimonials[current], {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    gsap.set(testimonials[current], { position: 'absolute' }); // Hide after fade out
                }
            });

            current = (current + 1) % testimonials.length;

            // Fade in next
            gsap.set(testimonials[current], { position: 'relative' }); // Take up space
            gsap.to(testimonials[current], { opacity: 1, duration: 0.5, delay: 0.5 });
        }

        // Auto-play and pause on hover
        let autoPlay = gsap.delayedCall(5, nextTestimonial).repeat(-1);
        slider.addEventListener('mouseenter', () => autoPlay.pause());
        slider.addEventListener('mouseleave', () => autoPlay.resume());
    }
});