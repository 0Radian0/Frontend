export default function Location() {
    return (
        <div id="map" className="map">
            <section>
                <h2>Znajdź nas tutaj</h2>
                <p>Lublin, Nadbystrzycka 36</p>
                <p>Hala Sportowa Politechniki Lubelskiej oraz "Rdzewiak"<br />
                    Wtorki: 17:30-20:00&nbsp; &nbsp;|&nbsp;&nbsp;Piątki: 17:00-18:30
                </p>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d502.59015930393815!2d22.551011184025!3d51.23612643109541!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47225771265bc477%3A0x8ae36897283722d1!2sCentrum%20Innowacji%20i%20Zaawansowanych%20Technologii%20Politechniki%20Lubelskiej!5e1!3m2!1spl!2spl!4v1729432603695!5m2!1spl!2spl"
                    width="400"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    aria-hidden="false"
                    tabIndex={0}
                ></iframe>

                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d422.63478309421345!2d22.55264169077926!3d51.235198951365696!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x472257714d035ce5%3A0xcf74c9fa007bec85!2sHala%20Sportowa%20Politechniki%20Lubelskiej!5e1!3m2!1spl!2spl!4v1729003278044!5m2!1spl!2spl"
                    width="400"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </section>
        </div>
    );
}