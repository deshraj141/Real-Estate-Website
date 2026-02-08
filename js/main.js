document.addEventListener('DOMContentLoaded', () => {
    console.log('Real Estate Website Loaded');
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('fixed-top');
            navbar.classList.add('shadow-sm');
        } else {
            navbar.classList.remove('fixed-top');
            navbar.classList.remove('shadow-sm');
        }
    });

    const applyFilterBtn = document.getElementById('applyFilter');
    const resetFilterBtn = document.getElementById('resetFilter');

    if (applyFilterBtn && resetFilterBtn) {
        applyFilterBtn.addEventListener('click', filterProperties);
        resetFilterBtn.addEventListener('click', resetFilters);
    }

    function filterProperties() {
        const locationStr = (document.getElementById('locationFilter').value || '').toLowerCase();
        const typeStr = (document.getElementById('typeFilter').value || '').toLowerCase();
        const priceStr = document.getElementById('priceFilter').value;

        const properties = document.querySelectorAll('.property-item');

        properties.forEach(item => {
            const itemLoc = (item.getAttribute('data-location') || '').toLowerCase();
            const itemType = (item.getAttribute('data-type') || '').toLowerCase();
            const itemPrice = parseInt(item.getAttribute('data-price'));

            let show = true;

            if (locationStr !== 'all' && !itemLoc.includes(locationStr)) {
                show = false;
            }

            if (typeStr !== 'all' && itemType !== typeStr) {
                show = false;
            }

            if (priceStr !== 'all') {
                if (priceStr === 'low' && itemPrice >= 20000000) show = false;
                if (priceStr === 'medium' && (itemPrice < 20000000 || itemPrice > 50000000)) show = false;
                if (priceStr === 'high' && itemPrice <= 50000000) show = false;
            }

            if (show) {
                item.style.display = 'block';
                item.classList.add('animate-up');
            } else {
                item.style.display = 'none';
                item.classList.remove('animate-up');
            }
        });
    }

    function resetFilters() {
        document.getElementById('locationFilter').value = 'all';
        document.getElementById('typeFilter').value = 'all';
        document.getElementById('priceFilter').value = 'all';

        const properties = document.querySelectorAll('.property-item');
        properties.forEach(item => {
            item.style.display = 'block';
            item.classList.add('animate-up');
        });
    }
    function renderProperties(list) {
        const grid = document.getElementById('propertyGrid');
        if (!grid) return;
        grid.innerHTML = '';

        list.forEach(prop => {
            const col = document.createElement('div');
            col.className = 'col-md-6 property-item';
            col.setAttribute('data-location', prop.location);
            col.setAttribute('data-type', prop.type);
            col.setAttribute('data-price', String(prop.price));

            const html = `
                <div class="card property-card h-100 border-0 shadow-sm">
                    <div class="position-relative">
                        <img src="${prop.image}" class="card-img-top" alt="${prop.title}">
                        <span class="badge bg-custom position-absolute top-0 start-0 m-3 px-3 py-2">${prop.formattedPrice}</span>
                    </div>
                    <div class="card-body">
                        <p class="text-muted small mb-1"><i class="fas fa-map-marker-alt text-accent me-1"></i> ${prop.address} (${prop.location})</p>
                        <h5 class="card-title"><a href="property-details.html?id=${prop.id}" class="text-decoration-none text-dark">${prop.title}</a></h5>
                        <p class="card-text text-muted small">${prop.type} • ${prop.state}</p>
                        <div class="d-flex justify-content-between mt-3 text-muted small">
                            <span><i class="fas fa-bed me-1"></i> ${prop.beds} Beds</span>
                            <span><i class="fas fa-bath me-1"></i> ${prop.baths} Baths</span>
                            <span><i class="fas fa-ruler-combined me-1"></i> ${prop.area}</span>
                        </div>
                    </div>
                    <div class="card-footer bg-white border-0 pb-3">
                        <a href="property-details.html?id=${prop.id}" class="btn btn-outline-custom w-100">View Details</a>
                    </div>
                </div>
            `;

            col.innerHTML = html;
            grid.appendChild(col);
        });
    }
    function populateFilters(list) {
        if (!Array.isArray(list)) return;

        const locSelect = document.getElementById('locationFilter');
        const typeSelect = document.getElementById('typeFilter');

        if (locSelect) {
            const locations = Array.from(new Set(list.map(p => p.location).filter(Boolean))).sort();
            locSelect.innerHTML = '<option value="all">All Locations</option>' + locations.map(l => `<option value="${l}">${l}</option>`).join('');
        }

        if (typeSelect) {
            const types = Array.from(new Set(list.map(p => p.type).filter(Boolean))).sort();
            typeSelect.innerHTML = '<option value="all">All Types</option>' + types.map(t => `<option value="${t}">${t}</option>`).join('');
        }
    }
    if (typeof propertiesData !== 'undefined' && Array.isArray(propertiesData)) {
        renderProperties(propertiesData);
        populateFilters(propertiesData);
    } else {
        console.warn('propertiesData not found. Ensure js/properties-data.js is included before js/main.js');
    }
    const statsSection = document.getElementById('statsSection');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = document.querySelectorAll('.counter');
                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        const speed = 200;
                        const increment = target / speed;

                        const updateCount = () => {
                            const count = +counter.innerText;
                            if (count < target) {
                                counter.innerText = Math.ceil(count + increment);
                                setTimeout(updateCount, 20);
                            } else {
                                counter.innerText = target;
                            }
                        };
                        updateCount();
                    });
                    observer.unobserve(statsSection);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreBtn.innerText = 'Loading...';
            setTimeout(() => {
                const blogGrid = document.getElementById('blogGrid');
                const newContent = `
                    <div class="col-md-6 blog-item animate-up">
                        <div class="card blog-card h-100 border-0 shadow-sm">
                            <img src="https://placehold.co/600x400/0d1b2a/white?text=New+Post" class="card-img-top" alt="Blog Post">
                            <div class="card-body">
                                <small class="text-accent text-uppercase fw-bold">Lifestyle</small>
                                <h5 class="card-title mt-2"><a href="#" class="text-decoration-none text-dark">Loaded Post Title</a></h5>
                                <p class="card-text text-muted small">This represents a newly loaded blog post content to demonstrate functionality.</p>
                                <a href="#" class="text-primary-custom fw-bold small">Read More <i class="fas fa-arrow-right list-inline-item"></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 blog-item animate-up">
                        <div class="card blog-card h-100 border-0 shadow-sm">
                            <img src="https://placehold.co/600x400/333333/white?text=New+Post+2" class="card-img-top" alt="Blog Post">
                            <div class="card-body">
                                <small class="text-accent text-uppercase fw-bold">Architecture</small>
                                <h5 class="card-title mt-2"><a href="#" class="text-decoration-none text-dark">Another Loaded Post</a></h5>
                                <p class="card-text text-muted small">More content loaded dynamically without a backend.</p>
                                <a href="#" class="text-primary-custom fw-bold small">Read More <i class="fas fa-arrow-right list-inline-item"></i></a>
                            </div>
                        </div>
                    </div>
                 `;
                blogGrid.insertAdjacentHTML('beforeend', newContent);
                loadMoreBtn.innerText = 'Load More';
            }, 1000);
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (!contactForm.checkValidity()) {
                contactForm.classList.add('was-validated');
            } else {

                alert('Message Sent Successfully! We will contact you soon.');
                contactForm.reset();
                contactForm.classList.remove('was-validated');
            }
        }, false);
    }
});
