window.addEventListener('DOMContentLoaded', () => {
    sessionStorage.setItem('loggedIn', 'false');
    sessionStorage.setItem('type', 'N/A');

    Misc.generateHeader();
    Misc.generateHome();
});

class Misc {
    static async highlightButton(name) {
        var buttons = document.querySelectorAll('.header-button');       

        buttons.forEach(button => {
            if (button.innerHTML == name) {
                button.style.borderColor = 'white';
            }
            else {
                button.style.borderColor = 'transparent';
            }
                       
        });
    }

    static generateHeader() {
        var header = document.querySelector('header');
        header.innerHTML = '';

        var img = document.createElement('img');
        img.src = 'img/logo.png';
        img.style.height = '3rem';
        img.style.width = '3rem';
        header.appendChild(img);

        if (sessionStorage.getItem('loggedIn') == 'false') {
            var btn = document.createElement('button');
            btn.innerHTML = 'Acasa';
            btn.type = 'button';
            btn.className = 'header-button';
            btn.onclick = Misc.generateHome;
            header.appendChild(btn);

            var btn = document.createElement('button');
            btn.innerHTML = 'Inregistrare';
            btn.type = 'button';
            btn.className = 'header-button';
            btn.onclick = Auth.generateRegister;
            header.appendChild(btn);

            var btn = document.createElement('button');
            btn.innerHTML = 'Autentificare';
            btn.type = 'button';
            btn.className = 'header-button';
            btn.onclick = Auth.generateLogin;
            header.appendChild(btn);
        }
        else {

            if (sessionStorage.getItem('type') == 'org') {
                var btn = document.createElement('button');
                btn.innerHTML = 'Acasa';
                btn.type = 'button';
                btn.className = 'header-button';
                btn.onclick = Org.generateHome;
                header.appendChild(btn);

                var btn = document.createElement('button');
                btn.innerHTML = 'Gestioneaza rezervarile';
                btn.type = 'button';
                btn.className = 'header-button';
                btn.onclick = Org.generateManageReservations;
                header.appendChild(btn);
            }
            else {
                var btn = document.createElement('button');
                btn.innerHTML = 'Acasa';
                btn.type = 'button';
                btn.className = 'header-button';
                btn.onclick = Misc.generateHome;
                header.appendChild(btn);

                var btn = document.createElement('button');
                btn.innerHTML = 'Vacantele mele';
                btn.type = 'button';
                btn.className = 'header-button';
                btn.onclick = User.generateMyHolidays;
                header.appendChild(btn);

            }

            var btn = document.createElement('button');
            btn.innerHTML = 'Logout';
            btn.type = 'button';
            btn.className = 'header-button';
            btn.onclick = Auth.logout;
            header.appendChild(btn);
        }
        
    }

    static async generateHome() {
        var main = document.querySelector('main');
        main.innerHTML = '';

        main.style.marginTop = '1rem';

        Misc.highlightButton('Acasa');

        var page = document.createElement('div');
        page.style.display = 'flex';
        page.style.flexDirection = 'row';
        page.style.flexWrap = 'wrap';
        page.style.justifyContent = 'center';
        page.style.width = '100%';
        main.appendChild(page);

        var activities = [];
        var reduction = 1;

        if (sessionStorage.getItem('loggedIn') == 'true') {
            var xhr2 = new XMLHttpRequest();
            xhr2.open('GET', '../agentieData/api/user/getReduction.php', false);
            xhr2.onreadystatechange = function () {
                if (xhr2.readyState == 4 && xhr2.status == 200) {
                    var res = JSON.parse(xhr2.responseText);

                    if (res.ok == true) {
                        reduction = res.reduction;
                    }
                }
            }
            xhr2.send();
        }

        var xhr1 = new XMLHttpRequest();
        xhr1.open('GET', '../agentieData/api/org/getActivities.php', false);
        xhr1.onreadystatechange = function () {
            if (xhr1.readyState == 4 && xhr1.status == 200) {
                var res = JSON.parse(xhr1.responseText);

                if (res.ok == true) {
                    activities = res.data;                   
                }
            }
        }
        xhr1.send();

        var xhr = new XMLHttpRequest();
        xhr.open('GET', '../agentieData/api/holiday/getVacations.php', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var res = JSON.parse(xhr.responseText);

                if (res.ok == true) {
                    res.vacations.forEach(x => {
                        var cont = document.createElement('div');
                        cont.className = 'vacation-container';
                        page.appendChild(cont);

                        var img = document.createElement('img');
                        img.src = 'data: image / jpeg;base64,' + x.img;
                        img.style.height = '25rem';
                        img.style.width = '25rem';
                        img.style.borderRadius = '1rem';
                        cont.appendChild(img);

                        var col = document.createElement('div');
                        col.className = 'holiday-column';
                        cont.appendChild(col);

                        var span = document.createElement('span');
                        span.innerHTML = x.name;
                        span.style.color = 'var(--color)';
                        span.style.fontWeight = 'bold';
                        span.style.fontSize = '1.5rem';
                        span.style.marginRight = '1rem';
                        col.appendChild(span);

                        var span = document.createElement('span');
                        span.innerHTML = "Companie: " + x.firstName + ' ' + x.lastName;
                        span.style.color = 'gray';
                        span.style.fontWeight = 'bold';
                        col.appendChild(span);

                        var p = document.createElement('p');
                        p.innerHTML = x.description;
                        p.style.fontWeight = 'bold';
                        col.appendChild(p);

                        var span = document.createElement('span');
                        span.innerHTML = "Pret: <span style='color: red;'>" + (x.price * reduction).toFixed(2) + '</span> RON';
                        span.style.fontWeight = 'bold';
                        span.style.color = 'var(--color)';
                        col.appendChild(span);

                        var start = new Date(x.start_time * 1000);
                        var end = new Date(x.end_time * 1000);

                        var span = document.createElement('span');
                        span.innerHTML = 'Perioada: ' + start.getDate().toString().padStart(2, '0') + '.' + (start.getMonth() + 1).toString().padStart(2, '0') + '.' +
                            start.getFullYear() + ' ' + start.getHours().toString().padStart(2, '0') + ':' + start.getMinutes().toString().padStart(2, '0') + ' - ' +
                            end.getDate().toString().padStart(2, '0') + '.' + (end.getMonth() + 1).toString().padStart(2, '0') + '.' +
                            end.getFullYear() + ' ' + end.getHours().toString().padStart(2, '0') + ':' + end.getMinutes().toString().padStart(2, '0');
                        span.style.fontWeight = 'bold';
                        span.style.color = 'gray';
                        col.appendChild(span);

                        var div = document.createElement('div');
                        col.appendChild(div);


                        var span = document.createElement('span');
                        span.innerHTML = 'Activitati posibile:';
                        span.style.fontWeight = 'bold';
                        span.style.color = 'var(--color)';
                        div.appendChild(span);

                        var ul = document.createElement('ul');
                        div.appendChild(ul);

                        var act = JSON.parse(x.allowed_activities);

                        act.forEach(y => {
                            var li = document.createElement('li');
                            var d = document.createElement('div');
                            d.style.display = 'flex';
                            d.style.flexDirection = 'column';
                            li.appendChild(d);                           
                            ul.appendChild(li);

                            var a = activities.find(z => z.id == y);

                            var span = document.createElement('span');
                            span.innerHTML = a.name + " - <span style='color: red'>" + a.price + "</span> RON";
                            span.style.color = 'var(--color)';
                            span.style.fontWeight = 'bold';
                            d.appendChild(span);

                            var span = document.createElement('span');
                            span.innerHTML = a.description;
                            span.style.color = 'gray';
                            d.appendChild(span);

                        });

                        var btn = document.createElement('button');
                        btn.innerHTML = 'Rezerva';
                        btn.className = 'button';
                        btn.type = 'button';
                        if (sessionStorage.getItem('loggedIn') == 'true') {
                            btn.onclick = function () {
                                Holiday.reserve(x.id, "vacation");
                            }
                        }
                        else {
                            btn.onclick = function () {
                                Auth.generateLogin();
                            }
                        }
                        col.appendChild(btn);
                    });


                    res.packages.forEach(x => {
                        var cont = document.createElement('div');
                        cont.className = 'vacation-container';
                        page.appendChild(cont);

                        var img = document.createElement('img');
                        img.src = 'data: image / jpeg;base64,' + x.img;
                        img.style.height = '25rem';
                        img.style.width = '25rem';
                        img.style.borderRadius = '1rem';
                        cont.appendChild(img);

                        var col = document.createElement('div');
                        col.className = 'holiday-column';
                        cont.appendChild(col);

                        var span = document.createElement('span');
                        span.innerHTML = x.name;
                        span.style.color = 'var(--color)';
                        span.style.fontWeight = 'bold';
                        span.style.fontSize = '1.5rem';
                        span.style.marginRight = '1rem';
                        col.appendChild(span);

                        var span = document.createElement('span');
                        span.innerHTML = "Companie: " + x.firstName + ' ' + x.lastName;
                        span.style.color = 'gray';
                        span.style.fontWeight = 'bold';
                        col.appendChild(span);

                        var p = document.createElement('p');
                        p.innerHTML = x.description;
                        p.style.fontWeight = 'bold';
                        col.appendChild(p);

                        var span = document.createElement('span');
                        span.innerHTML = "Pret: <span style='color: red;'>" + (x.price * reduction).toFixed(2) + '</span> RON';
                        span.style.fontWeight = 'bold';
                        span.style.color = 'var(--color)';
                        col.appendChild(span);

                        var start = new Date(x.start_time * 1000);
                        var end = new Date(x.end_time * 1000);

                        var span = document.createElement('span');
                        span.innerHTML = 'Perioada: ' + start.getDate().toString().padStart(2, '0') + '.' + (start.getMonth() + 1).toString().padStart(2, '0') + '.' +
                            start.getFullYear() + ' ' + start.getHours().toString().padStart(2, '0') + ':' + start.getMinutes().toString().padStart(2, '0') + ' - ' +
                            end.getDate().toString().padStart(2, '0') + '.' + (end.getMonth() + 1).toString().padStart(2, '0') + '.' +
                            end.getFullYear() + ' ' + end.getHours().toString().padStart(2, '0') + ':' + end.getMinutes().toString().padStart(2, '0');
                        span.style.fontWeight = 'bold';
                        span.style.color = 'gray';
                        col.appendChild(span);

                        var div = document.createElement('div');
                        col.appendChild(div);


                        var span = document.createElement('span');
                        span.innerHTML = 'Activitati incluse:';
                        span.style.fontWeight = 'bold';
                        span.style.color = 'var(--color)';
                        div.appendChild(span);

                        var ul = document.createElement('ul');
                        div.appendChild(ul);

                        var act = JSON.parse(x.included_activities);

                        act.forEach(y => {
                            var li = document.createElement('li');
                            var d = document.createElement('div');
                            d.className = 'column';
                            li.appendChild(d);
                            ul.appendChild(li);

                            var a = activities.find(z => z.id == y);

                            var span = document.createElement('span');
                            span.innerHTML = a.name + " - <span style='color: red'>" + a.price + "</span> RON";
                            span.style.color = 'var(--color)';
                            span.style.fontWeight = 'bold';
                            d.appendChild(span);

                            var span = document.createElement('span');
                            span.innerHTML = a.description;
                            span.style.color = 'gray';
                            d.appendChild(span);

                        });

                        var btn = document.createElement('button');
                        btn.innerHTML = 'Rezerva';
                        btn.className = 'button';
                        btn.type = 'button';
                        if (sessionStorage.getItem('loggedIn') == 'true') {
                            btn.onclick = function () {
                                Holiday.reserve(x.id, "package");
                            }
                        }
                        else {
                            btn.onclick = function () {
                                Auth.generateLogin();
                            }
                        }
                        col.appendChild(btn);
                    });
                }
            }
        }
        xhr.send();
    }
}

class Auth {
    static async generateRegister() {
        var main = document.querySelector('main');
        main.innerHTML = '';
        main.style.marginTop = '0';

        Misc.highlightButton('Inregistrare');

        var page = document.createElement('div');
        page.className = 'row';
        main.appendChild(page);

        var div = document.createElement('div');
        div.className = 'column';
        div.style.flex = '1';
        page.appendChild(div);

        var form = document.createElement('div');
        form.className = 'form';
        form.style.flex = '1';
        div.appendChild(form); 

        var img = document.createElement('img');
        img.src = 'img/register.jpeg';
        img.style.height = 'calc(100vh - ' + document.querySelector('header').clientHeight + 'px)';
        page.appendChild(img);

        var span = document.createElement('span');
        span.innerHTML = 'Inregistrare';
        form.appendChild(span);

        var label = document.createElement('label');
        label.innerHTML = 'Nume';
        form.appendChild(label);

        var input = document.createElement('input');
        input.type = 'text';
        input.id = 'lastName';
        form.appendChild(input);

        var label = document.createElement('label');
        label.innerHTML = 'Prenume';
        form.appendChild(label);

        var input = document.createElement('input');
        input.type = 'text';
        input.id = 'firstName';
        form.appendChild(input);

        var label = document.createElement('label');
        label.innerHTML = 'Email';
        form.appendChild(label);

        var input = document.createElement('input');
        input.type = 'email';
        input.id = 'email';
        input.onkeyup = Auth.checkEmail;
        form.appendChild(input);

        var label = document.createElement('label');
        label.innerHTML = 'Parola';
        form.appendChild(label);

        var input = document.createElement('input');
        input.type = 'password';
        input.id = 'password';
        input.onkeyup = Auth.checkPassword;
        form.appendChild(input);

        var label = document.createElement('label');
        label.innerHTML = 'Confirmare parola';
        form.appendChild(label);

        var input = document.createElement('input');
        input.type = 'password';
        input.id = 'confirmPassword';
        input.onkeyup = Auth.checkConfirmPassword;
        form.appendChild(input);

        var p = document.createElement('p');
        p.id = 'err';
        p.style.color = 'red';
        form.appendChild(p);

        var btn = document.createElement('button');
        btn.innerHTML = 'Inregistrare';
        btn.className = 'button';
        btn.type = 'button';
        btn.onclick = Auth.register;
        form.appendChild(btn);
    }

    static async checkEmail() {
        var email = document.getElementById('email').value;
        var err = document.getElementById('err');

        if(!email.includes('@') || !email.includes('.')) {
            err.innerHTML = 'Email invalid';
            return false;
        }

        var fomrData = new FormData();
        fomrData.append('email', email);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '../agentieData/api/auth/checkEmail.php', false);       
        var ok = false;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var res = JSON.parse(xhr.responseText); 

                if (res.ok == true) {
                    if (res.exists == true) {
                        err.innerHTML = 'Email deja folosit';
                        ok = false;
                    }
                    else {
                        err.innerHTML = '';
                        ok = true;
                    }
                }
                
            }
        }
        xhr.send(fomrData);

        return ok;

    }

    static async checkPassword() {
        var password = document.getElementById('password').value;
        var err = document.getElementById('err');

        if (password.length < 8) {
            err.innerHTML = 'Parola prea scurta';
            return false;
        }

        var A = /[A-Z]/.test(password);
        var a = /[a-z]/.test(password);
        var d = /[0-9]/.test(password);
        var sc = /^[a-zA-Z0-9]/.test(password);

        if (!A || !a || !d || !sc) {
            err.innerHTML = 'Parola trebuie sa contina cel putin o litera mare,<br> o litera mica, o cifra <br>si un caracter special';
            return false;
        }

        err.innerHTML = '';
        return true;
    }

    static async checkConfirmPassword() {
        var password = document.getElementById('password').value;
        var confirmPassword = document.getElementById('confirmPassword').value;
        var err = document.getElementById('err');

        if (password != confirmPassword) {
            err.innerHTML = 'Parolele nu coincid';
            return false;
        }

        err.innerHTML = '';
        return true;
    }

    static async register() {
        var lastName = document.getElementById('lastName').value;
        var firstName = document.getElementById('firstName').value;
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        var confirmPassword = document.getElementById('confirmPassword').value;
        var err = document.getElementById('err');

        if (lastName == '' || firstName == '' || email == '' || password == '' || confirmPassword == '') {            
            err.innerHTML = 'Toate campurile sunt obligatorii';
            return;
        }

        if (!Auth.checkEmail() || !Auth.checkPassword() || !Auth.checkConfirmPassword()) {
            return;
        }

        var fomrData = new FormData();
        fomrData.append('lastName', lastName);
        fomrData.append('firstName', firstName);
        fomrData.append('email', email);
        fomrData.append('password', password);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '../agentieData/api/auth/register.php', true);       
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var res = JSON.parse(xhr.responseText);

                if (res.ok == true) {
                    err.innerHTML = 'Inregistrare cu succes';
                    err.color = 'green';
                    setTimeout(() => {
                        Auth.generateLogin();
                    }, 5000);
                }
                else {
                    var err = document.getElementById('err');
                    err.innerHTML = 'Eroare la inregistrare';
                    console.log(res);
                }
            }
        }
        xhr.send(fomrData);
    }

    static async generateLogin() {
        var main = document.querySelector('main');
        main.innerHTML = '';
        main.style.marginTop = '0';

        Misc.highlightButton('Autentificare');

        var page = document.createElement('div');
        page.className = 'row';
        main.appendChild(page);       

        var img = document.createElement('img');
        img.src = 'img/login.jpeg';
        img.style.height = 'calc(100vh - ' + document.querySelector('header').clientHeight + 'px)';
        page.appendChild(img);

        var div = document.createElement('div');
        div.className = 'column';
        div.style.flex = '1';
        page.appendChild(div);

        var form = document.createElement('div');
        form.className = 'form';
        div.appendChild(form);

        var span = document.createElement('span');
        span.innerHTML = 'Autentificare';
        form.appendChild(span);

        var label = document.createElement('label');
        label.innerHTML = 'Email';
        form.appendChild(label);

        var input = document.createElement('input');
        input.type = 'email';
        input.id = 'email';
        form.appendChild(input);

        var label = document.createElement('label');
        label.innerHTML = 'Parola';
        form.appendChild(label);

        var input = document.createElement('input');
        input.type = 'password';
        input.id = 'password';
        form.appendChild(input);

        var p = document.createElement('p');
        p.id = 'err';
        p.style.color = 'red';
        form.appendChild(p);

        var btn = document.createElement('button');
        btn.innerHTML = 'Autentificare';
        btn.className = 'button';
        btn.type = 'button';
        btn.onclick = Auth.login;
        form.appendChild(btn);
    }

    static async login() {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        var err = document.getElementById('err');

        if (email == '' || password == '') {
            err.innerHTML = 'Toate campurile sunt obligatorii';
            return;
        }

        var fomrData = new FormData();
        fomrData.append('email', email);
        fomrData.append('password', password);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '../agentieData/api/auth/login.php', true);       
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var res = JSON.parse(xhr.responseText);

                if (res.ok == true) {
                    sessionStorage.setItem('loggedIn', 'true');
                    sessionStorage.setItem('type', res.type);
                    sessionStorage.setItem('id', res.id);
                    Misc.generateHeader();

                    if (res.type == 'org') {
                        Org.generateHome();
                    }
                    else {
                        Misc.generateHome();
                    }
                }
                else {
                    var err = document.getElementById('err');
                    err.innerHTML = 'Eroare la autentificare';
                    console.log(res);
                }
            }
        }
        xhr.send(fomrData);
    }

    static async logout() {
        sessionStorage.setItem('loggedIn', 'false');
        sessionStorage.setItem('type', 'N/A');
        sessionStorage.setItem('id', 'N/A');
        Misc.generateHeader();
        Misc.generateHome();

        var xhr = new XMLHttpRequest();
        xhr.open('GET', '../agentieData/api/auth/logout.php', true);
        xhr.send();
    }
}

class Org {
    static async generateHome() {
        var main = document.querySelector('main');
        main.innerHTML = '';

        Misc.highlightButton('Acasa');

        var page = document.createElement('div');
        page.className = 'column';
        main.appendChild(page);

        var row = document.createElement('div');
        row.className = 'row';
        row.style.marginTop = '2rem';
        page.appendChild(row);

        var pg = document.createElement('div');
        pg.style.display = 'flex';
        pg.style.flexDirection = 'row';
        pg.style.width = '100%';
        page.appendChild(pg);

        var div1 = document.createElement('div');
        div1.className = 'column';
        div1.style.flex = '1';
        div1.style.justifyContent = 'space-evenly';
        pg.appendChild(div1);

        var img1 = document.createElement('img');
        img1.src = 'img/img1.jpeg';
        img1.style.height = '25rem';
        img1.style.width = '25rem';
        img1.style.borderRadius = '1rem';
        div1.appendChild(img1);
          
        var img2 = document.createElement('img');
        img2.src = 'img/img2.jpeg';
        img2.style.height = '25rem';
        img2.style.width = '25rem';
        img2.style.borderRadius = '1rem';
        div1.appendChild(img2);

        var div2 = document.createElement('div');
        div2.className = 'column';
        div2.style.flex = '1';
        pg.appendChild(div2);

        var div3 = document.createElement('div');
        div3.className = 'column';
        div3.style.flex = '1';
        div3.style.justifyContent = 'space-evenly';
        pg.appendChild(div3);     

        var img3 = document.createElement('img');
        img3.src = 'img/img3.jpg';
        img3.style.height = '25rem';
        img3.style.width = '25rem';
        img3.style.borderRadius = '1rem';
        div3.appendChild(img3);

        var img4 = document.createElement('img');
        img4.src = 'img/img4.jpg';
        img4.style.height = '25rem';
        img4.style.width = '25rem';
        img4.style.borderRadius = '1rem';
        div3.appendChild(img4);

        var span = document.createElement('span');
        span.innerHTML = 'Alege actiune';
        span.style.color = 'var(--color)';
        span.style.fontWeight = 'bold';
        span.style.fontSize = '1.5rem';
        span.style.marginRight = '1rem';
        row.appendChild(span);

        var select = document.createElement('select');
        select.onchange = function (e) {
            if(e.target.value == 'adaugaVacanta') {
                Org.generateAddVacation();
            }
            else if(e.target.value == 'adaugaPachet') {
                Org.generateAddPackage();
            }
            else if(e.target.value == 'adaugaActivitate') {
                Org.generateAddActivity();
            }
        }
        row.appendChild(select);

        var option = document.createElement('option');
        option.value = 'adaugaVacanta'
        option.innerHTML = 'Adauga vacanta';
        select.appendChild(option);

        var option = document.createElement('option');
        option.value = 'adaugaPachet'
        option.innerHTML = 'Adauga pachet';
        select.appendChild(option);

        var option = document.createElement('option');
        option.value = 'adaugaActivitate';
        option.innerHTML = 'Adauga activitate';
        select.appendChild(option);

        var form = document.createElement('div');
        form.className = 'form';
        form.id = 'form';
        div2.appendChild(form);

        Org.generateAddVacation();
    }

    static async generateAddVacation() {
        var form = document.getElementById('form');
        form.innerHTML = '';

        var span = document.createElement('span');
        span.innerHTML = 'Adauga vacanta';
        form.appendChild(span);

        var label = document.createElement('label');
        label.innerHTML = 'Nume';
        form.appendChild(label);

        var input = document.createElement('input');
        input.type = 'text';
        input.id = 'name';
        form.appendChild(input);

        var label = document.createElement('label');
        label.innerHTML = 'Descriere';
        form.appendChild(label);

        var textarea = document.createElement('textarea');
        textarea.id = 'description';
        form.appendChild(textarea);

        var label = document.createElement('label');
        label.innerHTML = 'Pret';
        form.appendChild(label);

        var input = document.createElement('input');
        input.type = 'number';
        input.id = 'price';
        input.onkeyup = function () {
            if(this.value < 0) {
                this.value = 0;
            }
        }
        form.appendChild(input);

        var label = document.createElement('label');
        label.innerHTML = 'Activitati permise';
        form.appendChild(label);

        var select = document.createElement('select');
        select.id = 'activities';
        select.multiple = true;
        form.appendChild(select);

        var option = document.createElement('option');
        option.value = 'N/A';
        option.innerHTML = 'Nimic';
        select.appendChild(option);

        var xhr = new XMLHttpRequest();
        xhr.open('GET', '../agentieData/api/org/getActivities.php', false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var res = JSON.parse(xhr.responseText);

                if (res.ok == true) {
                    res.data.forEach(activity => {
                        var option = document.createElement('option');
                        option.value = activity.id;
                        option.innerHTML = activity.name;                       
                        select.appendChild(option);
                    });
                }
            }
        }
        xhr.send();

        var ul = document.createElement('ul');
        ul.id = 'selectedActivities';
        form.appendChild(ul);

        var label = document.createElement('label');
        label.innerHTML = 'Data inceput';
        form.appendChild(label);

        var input = document.createElement('input');
        input.type = 'datetime-local';
        input.id = 'startDate';
        form.appendChild(input);

        var label = document.createElement('label');
        label.innerHTML = 'Data sfarsit';
        form.appendChild(label);

        var input = document.createElement('input');
        input.type = 'datetime-local';
        input.id = 'endDate';
        form.appendChild(input);

        var input = document.createElement('input');
        input.type = 'file';
        input.id = 'file';
        form.appendChild(input);

        var p = document.createElement('p');
        p.id = 'err';
        p.style.color = 'red';
        form.appendChild(p);

        var btn = document.createElement('button');
        btn.innerHTML = 'Adauga';
        btn.className = 'button';
        btn.type = 'button';
        btn.onclick = Org.addVacation;
        form.appendChild(btn);
    }

    static async generateAddPackage() {
        var form = document.getElementById('form');
        form.innerHTML = '';

        var span = document.createElement('span');
        span.innerHTML = 'Adauga vacanta';
        form.appendChild(span);

        var label = document.createElement('label');
        label.innerHTML = 'Nume';
        form.appendChild(label);

        var input = document.createElement('input');
        input.type = 'text';
        input.id = 'name';
        form.appendChild(input);

        var label = document.createElement('label');
        label.innerHTML = 'Descriere';
        form.appendChild(label);

        var textarea = document.createElement('textarea');
        textarea.id = 'description';
        form.appendChild(textarea);

        var label = document.createElement('label');
        label.innerHTML = 'Pret';
        form.appendChild(label);

        var input = document.createElement('input');
        input.type = 'number';
        input.id = 'price';
        input.onkeyup = function () {
            if (this.value < 0) {
                this.value = 0;
            }
        }
        form.appendChild(input);

        var label = document.createElement('label');
        label.innerHTML = 'Activitati incluse';
        form.appendChild(label);

        var select = document.createElement('select');
        select.id = 'activities';
        select.multiple = true;
        form.appendChild(select);

        var option = document.createElement('option');
        option.value = 'N/A';
        option.innerHTML = 'Nimic';
        select.appendChild(option);

        var xhr = new XMLHttpRequest();
        xhr.open('GET', '../agentieData/api/org/getActivities.php', false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var res = JSON.parse(xhr.responseText);

                if (res.ok == true) {
                    res.data.forEach(activity => {
                        var option = document.createElement('option');
                        option.value = activity.id;
                        option.innerHTML = activity.name;
                        select.appendChild(option);
                    });
                }
            }
        }
        xhr.send();

        var ul = document.createElement('ul');
        ul.id = 'selectedActivities';
        form.appendChild(ul);

        var label = document.createElement('label');
        label.innerHTML = 'Data inceput';
        form.appendChild(label);

        var input = document.createElement('input');
        input.type = 'datetime-local';
        input.id = 'startDate';
        form.appendChild(input);

        var label = document.createElement('label');
        label.innerHTML = 'Data sfarsit';
        form.appendChild(label);

        var input = document.createElement('input');
        input.type = 'datetime-local';
        input.id = 'endDate';
        form.appendChild(input);
        
        var input = document.createElement('input');
        input.type = 'file';
        input.id = 'file';
        form.appendChild(input);

        var p = document.createElement('p');
        p.id = 'err';
        p.style.color = 'red';
        form.appendChild(p);


        var btn = document.createElement('button');
        btn.innerHTML = 'Adauga';
        btn.className = 'button';
        btn.type = 'button';
        btn.onclick = Org.addPackage;
        form.appendChild(btn);
    }

    static async generateAddActivity() {
        var form = document.getElementById('form');
        form.innerHTML = '';

        var span = document.createElement('span');
        span.innerHTML = 'Adauga activitate';
        form.appendChild(span);

        var label = document.createElement('label');
        label.innerHTML = 'Nume';
        form.appendChild(label);

        var input = document.createElement('input');
        input.type = 'text';
        input.id = 'name';
        form.appendChild(input);

        var label = document.createElement('label');
        label.innerHTML = 'Descriere';
        form.appendChild(label);

        var textarea = document.createElement('textarea');
        textarea.id = 'description';
        form.appendChild(textarea);

        var label = document.createElement('label');
        label.innerHTML = 'Pret';
        form.appendChild(label);

        var input = document.createElement('input');
        input.type = 'number';
        input.id = 'price';
        input.onkeyup = function () {
            if(this.value < 0) {
                this.value = 0;
            }
        }
        form.appendChild(input);

        var p = document.createElement('p');
        p.id = 'err';
        p.style.color = 'red';
        form.appendChild(p);

        var btn = document.createElement('button');
        btn.innerHTML = 'Adauga';
        btn.className = 'button';
        btn.type = 'button';
        btn.onclick = Org.addActivity;
        form.appendChild(btn);
    }

    static async addActivity() {
        var name = document.getElementById('name').value;
        var description = document.getElementById('description').value;
        var price = document.getElementById('price').value;
        var err = document.getElementById('err');

        if (name == '' || description == '' || price == '') {
            err.innerHTML = 'Toate campurile sunt obligatorii';
            return;
        }

        var fomrData = new FormData();
        fomrData.append('name', name);
        fomrData.append('description', description);
        fomrData.append('price', price);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '../agentieData/api/org/addActivity.php', true);       
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var res = JSON.parse(xhr.responseText);

                if (res.ok == true) {
                    Org.generateAddActivity();
                }
                else {
                    err.innerHTML = 'Eroare la adaugare';
                }
            }
        }
        xhr.send(fomrData);
    }

    static async addVacation() {
        var name = document.getElementById('name').value;
        var description = document.getElementById('description').value;
        var price = document.getElementById('price').value;
        var activities = document.getElementById('activities');
        var options = activities.querySelectorAll('option');  
        var file = document.getElementById('file').files[0];

        var reader = new FileReader();
        reader.readAsDataURL(file); 
        reader.onloadend = function() {
            var base64String = reader.result;
            var base64Data = base64String.split(',')[1];

            var selectedActivities = [];
            options.forEach(option => {
                if (option.selected) {
                    selectedActivities.push(option.value);
                }
            });

            var startDate = document.getElementById('startDate').value;
            var endDate = document.getElementById('endDate').value;
            var err = document.getElementById('err');

            if (name == '' || description == '' || price == '' || startDate == '' || endDate == '') {
                err.innerHTML = 'Toate campurile sunt obligatorii';
                return;
            }

            startDate = Math.floor(new Date(startDate).getTime() / 1000);
            endDate = Math.floor(new Date(endDate).getTime() / 1000);

            if (startDate >= endDate) {
                err.innerHTML = 'Data de inceput trebuie sa fie inainte de data de sfarsit';
                return;
            }

            var fomrData = new FormData();
            fomrData.append('name', name);
            fomrData.append('description', description);
            fomrData.append('price', price);
            fomrData.append('startDate', startDate);
            fomrData.append('endDate', endDate);
            fomrData.append('activities', JSON.stringify(selectedActivities));
            fomrData.append('file', base64Data);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', '../agentieData/api/org/addVacation.php', true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var res = JSON.parse(xhr.responseText);

                    if (res.ok == true) {
                        Org.generateAddVacation();
                    }
                    else {
                        err.innerHTML = 'Eroare la adaugare';
                    }
                }
            }
            xhr.send(fomrData);
        }
    }

    static async addPackage() {
        var name = document.getElementById('name').value;
        var description = document.getElementById('description').value;
        var price = document.getElementById('price').value;
        var activities = document.getElementById('activities');
        var options = activities.querySelectorAll('option');
        var file = document.getElementById('file').files[0];

        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            var base64String = reader.result;
            var base64Data = base64String.split(',')[1];

            var selectedActivities = [];
            options.forEach(option => {
                if (option.selected) {
                    selectedActivities.push(option.value);
                }
            });

            var startDate = document.getElementById('startDate').value;
            var endDate = document.getElementById('endDate').value;
            var err = document.getElementById('err');

            if (name == '' || description == '' || price == '' || startDate == '' || endDate == '') {
                err.innerHTML = 'Toate campurile sunt obligatorii';
                return;
            }

            startDate = Math.floor(new Date(startDate).getTime() / 1000);
            endDate = Math.floor(new Date(endDate).getTime() / 1000);

            if (startDate >= endDate) {
                err.innerHTML = 'Data de inceput trebuie sa fie inainte de data de sfarsit';
                return;
            }

            var fomrData = new FormData();
            fomrData.append('name', name);
            fomrData.append('description', description);
            fomrData.append('price', price);
            fomrData.append('startDate', startDate);
            fomrData.append('endDate', endDate);
            fomrData.append('activities', JSON.stringify(selectedActivities));
            fomrData.append('file', base64Data);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', '../agentieData/api/org/addPackage.php', true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var res = JSON.parse(xhr.responseText);

                    if (res.ok == true) {
                        Org.generateAddVacation();
                    }
                    else {
                        err.innerHTML = 'Eroare la adaugare';
                    }
                }
            }
            xhr.send(fomrData);
        }
    }

    static async generateManageReservations() {
        var main = document.querySelector('main');
        main.innerHTML = '';

        Misc.highlightButton('Gestioneaza rezervarile');

        var page = document.createElement('div');
        page.style.display = 'flex';
        page.style.flexDirection = 'row';
        page.style.width = '100%';
        main.appendChild(page);

        var l = document.createElement('div');
        l.className = 'column';
        l.style.flex = '1';
        page.appendChild(l);

        var r = document.createElement('div');
        r.className = 'column';
        r.style.flex = '1';
        page.appendChild(r);

        var div = document.createElement('div');
        div.style.width = '60%';
        r.appendChild(div);

        var canvas1 = document.createElement('canvas');
        div.appendChild(canvas1);

        var div = document.createElement('div');
        div.style.width = '60%';
        div.style.marginTop = '2rem';
        r.appendChild(div);

        var canvas2 = document.createElement('canvas');
        div.appendChild(canvas2);

        var div = document.createElement('div');
        div.style.width = '95%';
        div.style.marginTop = '2rem';
        r.appendChild(div);

        var canvas3 = document.createElement('canvas');
        div.appendChild(canvas3);       

        var activities = [];

        var xhr1 = new XMLHttpRequest();
        xhr1.open('GET', '../agentieData/api/org/getActivities.php', false);
        xhr1.onreadystatechange = function () {
            if (xhr1.readyState == 4 && xhr1.status == 200) {
                var res = JSON.parse(xhr1.responseText);

                if (res.ok == true) {
                    activities = res.data;
                }
            }
        }
        xhr1.send();

        var xhr = new XMLHttpRequest();
        xhr.open('GET', '../agentieData/api/org/getReservations.php', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var res = JSON.parse(xhr.responseText);

                if (res.ok == true) {
                    var ctx1 = canvas1.getContext('2d');
                    var ctx2 = canvas2.getContext('2d');
                    var ctx3 = canvas3.getContext('2d');                    

                    var vacationRevenue = res.vacationRevenue;
                    var packageRevenue = res.packageRevenue;
                    var totalRevenue = res.totalRevenue;
                    var activitiesRevenue = res.activitiesRevenue;
                    var activs = res.activities;

                    var data = {
                        datasets: [{
                            data: [vacationRevenue, packageRevenue],
                            backgroundColor: ['red', 'blue']
                        }],
                        labels: ['Vacante', 'Pachete']
                    };

                    var options = {
                        responsive: true,
                    };

                    new Chart(ctx1, {
                        type: 'pie',
                        data: data,
                        options: options
                    });

                    var data = {
                        datasets: [{
                            data: [activitiesRevenue, totalRevenue - activitiesRevenue],
                            backgroundColor: ['yellow', 'gray']
                        }],
                        labels: ['Activitati', 'Restul']
                    };

                    var options = {
                        responsive: true,
                    };

                    new Chart(ctx2, {
                        type: 'pie',
                        data: data,
                        options: options
                    });

                    var data = {
                        datasets: [{
                            label: "Activitati rezervate",
                            data: [],
                            backgroundColor: []
                        }],
                        labels: []
                    };

                    for (let x in activs) {
                        data.datasets[0].data.push(activs[x]);
                        data.labels.push(x);
                        data.datasets[0].backgroundColor.push('rgb(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')');
                    }

                    var options = {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    };

                    new Chart(ctx3, {
                        type: 'bar',
                        data: data,
                        options: options
                    });

                    res.data.forEach(x => {
                        var div = document.createElement('div');
                        div.className = 'vacation-container';
                        div.style.width = '95%';
                        l.appendChild(div);

                        var img = document.createElement('img');
                        img.src = 'data: image / jpeg;base64,' + x.img;
                        img.style.height = '25rem';
                        img.style.width = '25rem';
                        img.style.borderRadius = '1rem';
                        div.appendChild(img);

                        var col = document.createElement('div');
                        col.className = 'holiday-column';
                        div.appendChild(col);

                        var span = document.createElement('span');
                        span.innerHTML = x.name;
                        span.style.color = 'var(--color)';
                        span.style.fontWeight = 'bold';
                        span.style.fontSize = '1.5rem';
                        span.style.marginRight = '1rem';
                        col.appendChild(span);

                        var span = document.createElement('span');
                        span.innerHTML = "Utilizator: " + x.firstName + ' ' + x.lastName;
                        span.style.color = 'gray';
                        span.style.fontWeight = 'bold';
                        col.appendChild(span);

                        var p = document.createElement('p');
                        p.innerHTML = x.description;
                        p.style.fontWeight = 'bold';
                        col.appendChild(p);

                        var span = document.createElement('span');
                        span.innerHTML = "Pret: <span style='color: red;'>" + x.price + '</span> RON';
                        span.style.fontWeight = 'bold';
                        span.style.color = 'var(--color)';
                        col.appendChild(span);

                        var start = new Date(x.start_time * 1000);
                        var end = new Date(x.end_time * 1000);

                        var span = document.createElement('span');
                        span.innerHTML = 'Perioada: ' + start.getDate().toString().padStart(2, '0') + '.' + (start.getMonth() + 1).toString().padStart(2, '0') + '.' +
                            start.getFullYear() + ' ' + start.getHours().toString().padStart(2, '0') + ':' + start.getMinutes().toString().padStart(2, '0') + ' - ' +
                            end.getDate().toString().padStart(2, '0') + '.' + (end.getMonth() + 1).toString().padStart(2, '0') + '.' +
                            end.getFullYear() + ' ' + end.getHours().toString().padStart(2, '0') + ':' + end.getMinutes().toString().padStart(2, '0');
                        span.style.fontWeight = 'bold';
                        span.style.color = 'gray';
                        col.appendChild(span);

                        var div = document.createElement('div');
                        col.appendChild(div);

                        var span = document.createElement('span');
                        span.innerHTML = 'Activitati rezervate:';
                        span.style.fontWeight = 'bold';
                        span.style.color = 'var(--color)';
                        div.appendChild(span);

                        var ul = document.createElement('ul');
                        div.appendChild(ul);

                        if (x.activities != '' || a.activities != '[]') {
                            var act = JSON.parse(x.activities);

                            if (act.length == 0) {
                                var li = document.createElement('li');
                                li.innerHTML = 'Nimic';
                                ul.appendChild(li);
                            }
                            else {
                                act.forEach(y => {
                                    var li = document.createElement('li');
                                    ul.appendChild(li);

                                    var a = activities.find(z => z.id == y);

                                    li.innerHTML = a.name + " - <span style='color: red; font-weight: bold;'>" + a.price + "</span> RON";
                                });
                            }
                        }
                        else {
                            var li = document.createElement('li');
                            li.innerHTML = 'Nimic';
                            ul.appendChild(li);
                        }

                        var btn = document.createElement('button');
                        btn.innerHTML = 'Anuleaza';
                        btn.className = 'button';
                        btn.type = 'button';
                        btn.onclick = function () {
                            Org.cancelReservation(x.id);
                        }
                        col.appendChild(btn);
                    });
                }
            }
        }
        xhr.send();
    }

    static async cancelReservation(id) {
        var r = confirm('Esti sigur ca vrei sa anulezi aceasta rezervare?');

        if (r == false)
            return;

        var fomrData = new FormData();
        fomrData.append('id', id);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '../agentieData/api/org/cancelReservation.php', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var res = JSON.parse(xhr.responseText);

                if (res.ok == true) {
                    Org.generateManageReservations();
                }
                else {
                    console.log(res);
                }
            }
        }
        xhr.send(fomrData);
    }
}

class User {
    static async generateMyHolidays() {
        var main = document.querySelector('main');
        main.innerHTML = '';

        Misc.highlightButton('Vacantele mele');

        var page = document.createElement('div');
        page.className = 'page';
        main.appendChild(page);

        var activities = [];       

        var xhr1 = new XMLHttpRequest();
        xhr1.open('GET', '../agentieData/api/org/getActivities.php', false);
        xhr1.onreadystatechange = function () {
            if (xhr1.readyState == 4 && xhr1.status == 200) {
                var res = JSON.parse(xhr1.responseText);

                if (res.ok == true) {
                    activities = res.data;
                }
            }
        }
        xhr1.send();

        var xhr = new XMLHttpRequest();
        xhr.open('GET', '../agentieData/api/user/getMyHolidays.php', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var res = JSON.parse(xhr.responseText);

                if (res.ok == true) {
					//console.log(res);
                    res.data.forEach(x => {
                        var cont = document.createElement('div');
                        cont.className = 'vacation-container';
                        cont.style.minWidth = '60%';
                        page.appendChild(cont);

                        var img = document.createElement('img');
                        img.src = 'data: image / jpeg;base64,' + x.img;
                        img.style.height = '25rem';
                        img.style.width = '25rem';
                        img.style.borderRadius = '1rem';
                        cont.appendChild(img);

                        var col = document.createElement('div');
                        col.className = 'holiday-column';
                        cont.appendChild(col);

                        var span = document.createElement('span');
                        span.innerHTML = x.name;
                        span.style.color = 'var(--color)';
                        span.style.fontWeight = 'bold';
                        span.style.fontSize = '1.5rem';
                        span.style.marginRight = '1rem';
                        col.appendChild(span);

                        var span = document.createElement('span');
                        span.innerHTML = "Companie: " + x.firstName + ' ' + x.lastName;
                        span.style.color = 'gray';
                        span.style.fontWeight = 'bold';
                        col.appendChild(span);

                        var p = document.createElement('p');
                        p.innerHTML = x.description;
                        p.style.fontWeight = 'bold';
                        col.appendChild(p);

                        var span = document.createElement('span');
                        span.innerHTML = "Pret: <span style='color: red;'>" + x.price + '</span> RON';
                        span.style.fontWeight = 'bold';
                        span.style.color = 'var(--color)';
                        span.id = "price-" + x.id;
                        col.appendChild(span);

                        var start = new Date(x.start_time * 1000);
                        var end = new Date(x.end_time * 1000);

                        var span = document.createElement('span');
                        span.innerHTML = 'Perioada: ' + start.getDate().toString().padStart(2, '0') + '.' + (start.getMonth() + 1).toString().padStart(2, '0') + '.' +
                            start.getFullYear() + ' ' + start.getHours().toString().padStart(2, '0') + ':' + start.getMinutes().toString().padStart(2, '0') + ' - ' +
                            end.getDate().toString().padStart(2, '0') + '.' + (end.getMonth() + 1).toString().padStart(2, '0') + '.' +
                            end.getFullYear() + ' ' + end.getHours().toString().padStart(2, '0') + ':' + end.getMinutes().toString().padStart(2, '0');
                        span.style.fontWeight = 'bold';
                        span.style.color = 'gray';
                        col.appendChild(span);

                        var div = document.createElement('div');
                        div.className = 'column';
                        div.id = 'activities-' + x.id;
                        col.appendChild(div);


                        var alw = JSON.parse(x.allowed);
                        var act = '';
                        if (x.activities != '') {
                            act = JSON.parse(x.activities);
                        }

                        alw.forEach(y => {
                            var a = activities.find(z => z.id == y);
                            var row = document.createElement('div');
                            row.className = 'row';
                            row.style.padding = '0.5rem';
                            row.style.margin = '0.5rem';
                            row.style.border = '1px solid var(--color)';
                            row.style.borderRadius = '1rem';
                            row.style.width = 'calc(100% - 2rem)';
                            div.appendChild(row);

                            var input = document.createElement('input');
                            input.type = 'checkbox';
                            input.id = a.id;
                            input.style.height = '1rem';
                            input.style.width = '1rem';
                            if (act.includes(y)) {
                                input.checked = true;
                            }
							if(x.type == "package")
								input.disabled = true;
                            row.appendChild(input);

                            var col = document.createElement('div');
                            col.className = 'column';
                            col.style.paddingLeft = '1rem';
                            row.appendChild(col);

                            var span = document.createElement('span');
                            span.innerHTML = a.name + " - <span style='color: red'>" + a.price + "</span> RON";
                            span.style.fontWeight = 'bold';
                            span.style.color = 'var(--color)';
                            col.appendChild(span);

                            var span = document.createElement('span');
                            span.innerHTML = a.description;
                            span.style.color = 'gray';
                            col.appendChild(span);
                        });

                        var row = document.createElement('div');
                        row.className = 'row';
                        row.style.width = '100%';
                        row.style.justifyContent = 'space-evenly';
                        col.appendChild(row);

                        var btn = document.createElement('button');
                        btn.innerHTML = 'Salveaza';
                        btn.className = 'button';
                        btn.type = 'button';
                        btn.onclick = function () {
                            User.modifyHoliday(x.id, act, x.price, activities);
                        }
                        row.appendChild(btn);

                        var btn = document.createElement('button');
                        btn.innerHTML = 'Anuleaza';
                        btn.className = 'button';
                        btn.type = 'button';
                        btn.onclick = function () {
                            User.cancelHoliday(x.id);
                        }
                        row.appendChild(btn);

                    });
                }
            }
        }
        xhr.send();
    }

    static async modifyHoliday(id, act, price, all) {
        var acts = document.getElementById('activities-' + id).querySelectorAll('input');

        var ids = [];

        acts.forEach(x => {
            if (x.checked) {
                ids.push(x.id);
            }
        });

        price = parseFloat(price);

        if (act != '') {
            act.forEach(x => {
                var a = all.find(y => y.id = x);

                if (a != null) {
                    price -= parseFloat(a.price);
                }

            });
        }

        ids.forEach(x => {
            var a = all.find(y => y.id = x);

            price += parseFloat(a.price);
        });

        var formData = new FormData();
        formData.append("id", id);
        formData.append("ids", JSON.stringify(ids));
        formData.append("price", price);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '../agentieData/api/user/modifyHoliday.php', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var res = JSON.parse(xhr.responseText);

                if (res.ok == true) {
                    alert("Modificari salvate");
                    document.getElementById("price-" + id).innerHTML = "Pret: " + price + "RON";
                }
                else {
                    alert("Eroare la modificare");
                }
            }
        }
        xhr.send(formData);
    }

    static async cancelHoliday(id) {
        var r = window.confirm("Sigur anulezi vacanta?");

        if (r == false)
            return;

        var xhr = new XMLHttpRequest();

        var formData = new FormData();
        formData.append("id", id);

        xhr.open('POST', '../agentieData/api/user/cancelHoliday.php', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var res = JSON.parse(xhr.responseText);

                if (res.ok == true) {
                    User.generateMyHolidays();
                }
                else {
                    console.log(res);
                }
            }
        }
        xhr.send(formData);

    }
}

class Holiday {
    static async reserve(id, type) {
        var r = window.confirm('Doriti sa rezervati aceasta vacanta?');

        if (r == false)
            return;

        var fomrData = new FormData();
        fomrData.append('id', id);
        fomrData.append('type', type);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '../agentieData/api/holiday/reserve.php', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var res = JSON.parse(xhr.responseText);

                if (res.ok == true) {
                    User.generateMyHolidays();
                }
                else {
                    console.log(res);
                }
            }
        }
        xhr.send(fomrData);

    }
}