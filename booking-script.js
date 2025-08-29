document.addEventListener('DOMContentLoaded', function() {
    const transportTabs = document.querySelectorAll('.transport-tab');
    const bookingForms = document.querySelectorAll('.booking-form');
    const ticketForms = document.querySelectorAll('.ticket-form');
    const successModal = document.getElementById('successModal');
    const closeButtons = document.querySelectorAll('.close');
    
    // Tab switching
    transportTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            transportTabs.forEach(t => t.classList.remove('active'));
            bookingForms.forEach(f => f.classList.remove('active'));
            
            this.classList.add('active');
            
            const transport = this.getAttribute('data-transport');
            const targetForm = document.getElementById(transport + 'Form');
            if (targetForm) {
                targetForm.classList.add('active');
            }
        });
    });
    
    // Show bus form by default
    const busForm = document.getElementById('busForm');
    if (busForm) {
        busForm.classList.add('active');
    }
    
    // Enhanced Form submissions with instant feedback
    ticketForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let formType = 'bus';
            if (this.closest('#trainForm')) formType = 'train';
            if (this.closest('#airplaneForm')) formType = 'airplane';
            
            const email = document.getElementById(formType + 'Email').value;
            const from = document.getElementById(formType + 'From').value;
            const to = document.getElementById(formType + 'To').value;
            const date = document.getElementById(formType + 'Date').value;
            const passengers = document.getElementById(formType + 'Passengers').value;
            const timing = document.getElementById(formType + 'Timing').value;
            
            // Show loading state immediately
            const submitBtn = this.querySelector('.pay-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;
            
            const templateParams = {
                email: email,
                from: from,
                to: to,
                journey_date: date,
                passengers: passengers,
                timing: timing,
                booking_time: new Date().toLocaleString(),
                booking_type: formType.charAt(0).toUpperCase() + formType.slice(1)
            };
            
            // Quick response after 500ms
            setTimeout(() => {
                // Reset form and button immediately
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show success modal (only the center box)
                successModal.style.display = 'block';
                
                // EmailJS send in background - no notifications
                emailjs.send("service_leuefnf", "template_b0roqt8", templateParams)
                    .then(() => {
                        console.log('✅ Email sent successfully in background');
                    })
                    .catch((error) => {
                        console.error('❌ EmailJS error:', error);
                    });
                    
            }, 500); // Only 0.5 second delay for instant feel
        });
    });
    
    // Close modal
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            successModal.style.display = 'none';
        });
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === successModal) {
            successModal.style.display = 'none';
        }
    });
    
    // Set minimum date to today
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(input => {
        input.min = today;
    });
    
    // Navigation highlighting
    const navLinks = document.querySelectorAll('.nav-item');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    console.log('🚀 TravelEase Booking System - Clean version!');
});
document.addEventListener('DOMContentLoaded', () => {
    /* booking-system वाला पूरा कोड */

    /* ------- logout वाला हिस्सा ---- */
    const btn = document.getElementById('logoutBtn');
    if (btn){
        btn.addEventListener('click', async e => { /* ...same fetch... */ });
    }
});

