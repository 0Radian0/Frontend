import HemaImg from "../assets/images/hema.jpg";
import RekoImg from "../assets/images/96b.jpg";

export default function HemaReko() {
    return (
        <div className="Container_zdj_1">
            <div className="left_photo">
                <img src={HemaImg} alt="Obraz przedstawiający HEMA" />
                <p className="l_overlay-text">
                    <span className="heading">HEMA</span><br />
                    Dawne europejskie sztuki walki,<br />
                    (ang. Historical European martial arts) – sport walki oparty na badaniu i
                    odtwarzaniu dawnych europejskich technik bojowych. Łączy badania historyczne z
                    praktyką, odtwarzając tradycyjne style szermierki i walki przy użyciu symulatorów
                    broni historycznej, takich jak miecze, szable i inne.
                </p>
            </div>
            <div className="read-more-button">
                <a href="#kim_jestesmy" className="button-link">Czytaj dalej</a>
            </div>
            <div className="right_photo">
                <img src={RekoImg} alt="REKO" />
                <div className="r_overlay-text">
                    <span className="heading">REKO</span><br />
                    Grupa rekonstrukcyjna specjalizująca się na wiernym przywracaniu wyglądu, uzbrojenia, formacji
                    i stylu życia żołnierzy z XV-XVII wieku. Poprzez staranne odwzorowanie detali oraz badania historyczne
                    przybliżają widzom kulturę tamtego okresu.
                </div>
            </div>
        </div>
        );
}