import React from 'react'

const AboutAuthor = () => {
    const reviews = [
        {
            name: 'Mahatma Gandhi',
            title: 'Father of Nation ',
            imageUrl: 'https://assets.editorial.aetnd.com/uploads/2010/07/mahatma-gandhi-gettyimages-102701091-2048x2048-1.jpg', // Replace with the actual path to your image
            comment: '"When doubts haunt me, when disappointments stare me in the face, and I see not one ray of hope on the horizon, I turn to Bhagavad-Gita and find a verse to comfort me;and I immediately begin to smile in the midst of overwhelming sorrow. Those who meditate on the Gita will derive fresh joy and new meanings from it every day"',
        },
        {
            name: 'Aldous Huxley',
            title: 'English Writer',
            imageUrl: 'https://campuspress.yale.edu/modernismlab/files/2017/07/Aldous_Huxley.jpg', // Replace with the actual path to your image
            comment: '"The Gita is most systematic statement of spiritual evolution of endowing value to mankind. It is also one of the most clear and comprehensive summaries of perennial philosophy ever revealed; hence its enduring value is subject not only to India but to all of humanity."',
        },
        {
            name: 'Henry David Thoreau',
            title: 'American Poet & Philospher',
            imageUrl: 'https://hips.hearstapps.com/hmg-prod/images/gettyimages-3264616.jpg', // Replace with the actual path to your image
            comment: '"In the morning I bathe my intellect in the stupendous and cosmogonal philosophy of the Bhagavad Gita in comparison with which our modern world and itsliterature seem puny and trivial."',
        },
        {
            name: 'Annie Besant',
            title: 'English Socialist & Theosophist',
            imageUrl: 'https://images.livemint.com/rf/Image-621x414/LiveMint/Period2/2017/10/07/Photos/Processed/AnnieBesant-k8eE--621x414@LiveMint.jpg', // Replace with the actual path to your image
            comment: '"That the spiritual man need not be a recluse, that union with the divine Life may be achieved and maintained in the midst of worldly affairs, that the obstacles to that union lie not outside us but within us-such is the central lesson of the Bhagavad-Gitā."',
        },
    ];
    return (
        <div className='container content-center m-auto p-10'>
            <div className="carousel  w-9/12">
                <div id="item1" className="card card-side bg-white shadow-xl carousel-item w-full m-auto">
                    <figure><img className='w-40 h-101' src="https://iskconberkeley.us/wp-content/uploads/2019/05/srila-prabhupada-square.jpg" alt="Movie" /></figure>
                    <div className="card-body w-2/4">
                        {/* <h2 className="card-title">New movie is released!</h2> */}
                        <p>HDG Abhaya Charanaravinda Bhaktivedanta Swami Prabhupada, fondly known as Srila Prabhupada is a scholar and a spiritual leader. He is the 32nd Acharya of the Brahma Madhva Gaudiya Sampradaya. The roots of this disciplic succession are very authentic. Lord Krishna Himself is the genesis of this parampara. Srila Prabhupada founded the ISKCON society, in order to further the mission of Lord Earthytanya, who also appeared in this sampradaya.</p>
                    </div>
                </div>
                <div id="item2" className="card card-side bg-white shadow-xl carousel-item w-full m-auto">
                    <figure><img className='w-40 h-101' src="https://iskconberkeley.us/wp-content/uploads/2019/05/srila-prabhupada-square.jpg" alt="Movie" /></figure>
                    <div className="card-body w-2/4">
                        {/* <h2 className="card-title">New movie is released!</h2> */}
                        <p>HDG Abhaya Charanaravinda Bhaktivedanta Swami Prabhupada, fondly known as Srila Prabhupada is a scholar and a spiritual leader. He is the 32nd Acharya of the Brahma Madhva Gaudiya Sampradaya. The roots of this disciplic succession are very authentic. Lord Krishna Himself is the genesis of this parampara. Srila Prabhupada founded the ISKCON society, in order to further the mission of Lord Earthytanya, who also appeared in this sampradaya.</p>
                    </div>
                </div>
                <div id="item3" className="card card-side bg-white shadow-xl carousel-item w-full m-auto">
                    <figure><img className='w-40 h-101' src="https://iskconberkeley.us/wp-content/uploads/2019/05/srila-prabhupada-square.jpg" alt="Movie" /></figure>
                    <div className="card-body w-2/4">
                        {/* <h2 className="card-title">New movie is released!</h2> */}
                        <p>HDG Abhaya Charanaravinda Bhaktivedanta Swami Prabhupada, fondly known as Srila Prabhupada is a scholar and a spiritual leader. He is the 32nd Acharya of the Brahma Madhva Gaudiya Sampradaya. The roots of this disciplic succession are very authentic. Lord Krishna Himself is the genesis of this parampara. Srila Prabhupada founded the ISKCON society, in order to further the mission of Lord Earthytanya, who also appeared in this sampradaya.</p>
                    </div>
                </div>
                <div id="item4" className="card card-side bg-white shadow-xl carousel-item w-full m-auto">
                    <figure><img className='w-40 h-101' src="https://iskconberkeley.us/wp-content/uploads/2019/05/srila-prabhupada-square.jpg" alt="Movie" /></figure>
                    <div className="card-body w-2/4">
                        {/* <h2 className="card-title">New movie is released!</h2> */}
                        <p>HDG Abhaya Charanaravinda Bhaktivedanta Swami Prabhupada, fondly known as Srila Prabhupada is a scholar and a spiritual leader. He is the 32nd Acharya of the Brahma Madhva Gaudiya Sampradaya. The roots of this disciplic succession are very authentic. Lord Krishna Himself is the genesis of this parampara. Srila Prabhupada founded the ISKCON society, in order to further the mission of Lord Earthytanya, who also appeared in this sampradaya.</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-center w-full py-2 gap-2">
                <a href="#item1" className="btn btn-xs">1</a>
                <a href="#item2" className="btn btn-xs">2</a>
                <a href="#item3" className="btn btn-xs">3</a>
                <a href="#item4" className="btn btn-xs">4</a>
            </div>
        </div>
    );
};
export default AboutAuthor
