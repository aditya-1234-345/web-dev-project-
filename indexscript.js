//java script code
document.addEventListener('DOMContentLoaded', () => {

    /* ====== 1. DOM ELEMENTS ====== */
    const authModal          = document.getElementById('authModal');
    const loginRequiredModal = document.getElementById('loginRequiredModal');
    const signInBtn          = document.getElementById('signInBtn');
    const logInBtn           = document.getElementById('logInBtn');
    const authTabs           = document.querySelectorAll('.auth-tab');
    const authForms          = document.querySelectorAll('.auth-form');
    const navItems           = document.querySelectorAll('.nav-item');
    const closeButtons       = document.querySelectorAll('.close');
    const bookNowBtn         = document.querySelector('.book-now-btn');
    const exploreBtn         = document.querySelector('.explore-btn');
    const signinForm         = document.getElementById('signinForm');
    const loginForm          = document.getElementById('loginForm');

    /* ====== 2. STATE ====== */
    let isLoggedIn = false;      // एक ही global state

    /* ====== 3. NAVIGATION, SCROLL-SPY, ETC. (तुम्हारा पुराना code) ====== */
    navItems.forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const target = document.getElementById(item.getAttribute('href').substring(1));
            if (target) target.scrollIntoView({behavior: 'smooth', block: 'start'});
        });
    });

    const sections = document.querySelectorAll('section[id]');
    const updateActiveNav = () => {
        let current = '';
        sections.forEach(sec => {
            if (pageYOffset >= sec.offsetTop - 200) current = sec.id;
        });
        navItems.forEach(i => {
            i.classList.toggle('active', i.getAttribute('href') === `#${current}`);
        });
    };
    updateActiveNav();
    window.addEventListener('scroll', updateActiveNav);

    /* ====== 4. BOOK-NOW / EXPLORE BUTTONS ====== */
    bookNowBtn.addEventListener('click', () => {
        if (!isLoggedIn) {
            loginRequiredModal.style.display = 'flex';
        } else {
            document.getElementById('gallery').scrollIntoView({behavior:'smooth',block:'start'});
        }
    });
    exploreBtn.addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('services').scrollIntoView({behavior:'smooth',block:'start'});
    });

    /* ====== 5. MINI-MODAL (LOGIN REQUIRED) ====== */
    document.getElementById('miniSignIn').onclick = () => {
        loginRequiredModal.style.display = 'none';
        openAuthModal('signin');
    };
    document.getElementById('miniLogIn').onclick = () => {
        loginRequiredModal.style.display = 'none';
        openAuthModal('login');
    };
    document.querySelector('.mini-close').onclick = () => {
        loginRequiredModal.style.display = 'none';
    };

    /* ====== 6. AUTH MODAL TABS ====== */
    const openAuthModal = tab => {
        authModal.style.display = 'block';
        authTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
        authForms.forEach(f => f.classList.toggle('active', f.id === `${tab}Tab`));
    };

    signInBtn.onclick = () => openAuthModal('signin');
    logInBtn.onclick  = () => openAuthModal('login');

    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const t = tab.dataset.tab;
            authTabs.forEach(x => x.classList.remove('active'));
            authForms.forEach(x => x.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`${t}Tab`).classList.add('active');
        });
    });

    /* close buttons (×) */
    closeButtons.forEach(btn => btn.onclick = () => btn.closest('.modal').style.display = 'none');
    window.addEventListener('click', e => {
        if (e.target.classList.contains('modal') || e.target.classList.contains('mini-modal')) {
            e.target.style.display = 'none';
        }
    });

    /* ====== 7. CONTACT & FEEDBACK FORMS (unchanged) ====== */
    const showTopNotification = (title, msg) => {
        const note = document.createElement('div');
        note.style.cssText = `
            position:fixed;top:-100px;left:50%;transform:translateX(-50%);
            background:linear-gradient(135deg,#4CAF50,#45a049);color:#fff;
            padding:20px 30px;border-radius:10px;box-shadow:0 5px 20px rgba(0,0,0,.3);
            z-index:10000;text-align:center;min-width:300px;max-width:500px;transition:.5s`;
        note.innerHTML = `<h3 style="margin:0 0 10px">${title}</h3><p style="margin:0">${msg}</p>`;
        document.body.appendChild(note);
        setTimeout(()=>note.style.top='20px',100);
        setTimeout(()=>{note.style.top='-100px'; setTimeout(()=>note.remove(),500);},4000);
        note.onclick = () => {note.style.top='-100px'; setTimeout(()=>note.remove(),500);};
    };

    document.getElementById('contactForm').addEventListener('submit', e=>{
        e.preventDefault(); showTopNotification('🎉 Thanks for contacting us!',
        'Your message has been sent successfully. We will get back to you soon!'); e.target.reset();
    });
    document.getElementById('feedbackForm').addEventListener('submit', e=>{
        e.preventDefault(); showTopNotification('🎉 Thanks for your feedback!',
        'Your feedback has been submitted successfully. We appreciate your input!'); e.target.reset();
    });

    /* Sign-Up */
    signinForm.addEventListener('submit', async e => {
        e.preventDefault();
        const data = {
            fullName : document.getElementById('signupName').value,
            email    : document.getElementById('signupEmail').value,
            phone    : document.getElementById('signupPhone').value,
            password : document.getElementById('signupPassword').value
        };
        await hitEndpoint('signup.php', data);
    });

    /* Log-In */
    loginForm.addEventListener('submit', async e => {
        e.preventDefault();
        const data = {
            email    : document.getElementById('loginEmail').value,
            password : document.getElementById('loginPassword').value
        };
        await hitEndpoint('login.php', data);
    });

    async function hitEndpoint(url, payload){
        try{
            const res = await fetch(url,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(payload)
            });
            const out = await res.json();
            out.success ? handleSuccessfulAuth(out.message,out.user)
                        : showToast(out.message,'#ff4757','#c44569');
        }catch(err){
            showToast('Network error. Try again.','#ff4757','#c44569');
        }
    }


    

    /* ====== 9. SUCCESS / ERROR TOASTS & REDIRECT ====== */
    function handleSuccessfulAuth(msg,user){
            console.log("USER DATA:", user);  

        isLoggedIn = true;
        authModal.style.display='none';
        localStorage.setItem('userData', JSON.stringify(user));
        showToast(msg,'#00c851','#007e33');

        setTimeout(()=>window.location.href='bookingticket.html',2000);


        emailjs.send("service_hxn2csw", "template_ikykwge", {
    user_name: user.name || "User",
    user_email: user.email,
    message: "You have successfully signed in to 🌎 TravelEase!"
})
.then(function(response) {
   console.log("Email sent successfully", response);
})
.catch(function(error) {
   console.error("Email sending failed", error);
});

    }





    function showToast(text,col1,col2){
        const div=document.createElement('div');
        div.innerHTML=`<i class="fas fa-info-circle"></i><span style="margin-left:8px">${text}</span>`;
        div.style.cssText=`
            position:fixed;top:20px;right:20px;padding:15px 20px;
            background:linear-gradient(135deg,${col1},${col2});
            color:#fff;border-radius:10px;display:flex;align-items:center;
            gap:10px;box-shadow:0 5px 15px rgba(0,0,0,.2);opacity:0;
            transform:translateX(300px);z-index:10000;transition:.3s`;
        document.body.appendChild(div);
        setTimeout(()=>{div.style.opacity='1';div.style.transform='translateX(0)';},100);
        setTimeout(()=>{div.style.opacity='0';div.style.transform='translateX(300px)';
            setTimeout(()=>div.remove(),300);},3000);
    }

});




