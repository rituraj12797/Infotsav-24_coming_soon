import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";
gsap.registerPlugin(ScrollTrigger);

export default function Scene() {
    const component = useRef<HTMLDivElement | null>(null);
    const slider = useRef<HTMLDivElement | null>(null);

    function handleMouseMove(event: React.MouseEvent<HTMLLIElement, MouseEvent>) {
        let item = event.currentTarget as HTMLElement;
        let centerX = item.getBoundingClientRect().left + item.offsetWidth / 2;
        let centerY = item.getBoundingClientRect().top + item.offsetHeight / 2;
        let mouseX = event.clientX - centerX;
        let mouseY = event.clientY - centerY;
        item.style.top = `${mouseY / 7}px`;
        item.style.left = `${mouseX / 7}px`;
        item.style.transform = `scale(1.05)`;
    }

    function handleMouseLeave(event: React.MouseEvent<HTMLLIElement, MouseEvent>) {
        let item = event.currentTarget as HTMLElement;
        item.style.top = `0px`;
        item.style.left = `0px`;
        item.style.transform = `scale(1)`;
    }

    useLayoutEffect(() => {
        let items = gsap.utils.toArray(".items")[0] as HTMLElement;
        let pageWrapper = document.querySelector(".page-wrapper");

        let distance = () => {
            let lastItemBounds = items.lastElementChild?.getBoundingClientRect() ;
            let containerBounds = items.getBoundingClientRect();
            return Math.max(0, lastItemBounds.right - containerBounds.right);
        };

        gsap.to(items, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
                trigger: items,
                start: "top top",
                end: () => "+=" + distance(),
                scrub: true,
                pin: pageWrapper,
                anticipatePin: 1,
                invalidateOnRefresh: true
            }
        });

        let proxy = { skew: 0 },
            skewSetter = gsap.quickSetter(".item", "skewX", "deg"),
            clamp = gsap.utils.clamp(-20, 20);

        ScrollTrigger.create({
            onUpdate: (self) => {
                let skew = clamp(self.getVelocity() / -300);
                if (Math.abs(skew) > Math.abs(proxy.skew)) {
                    proxy.skew = skew;
                    gsap.to(proxy, {
                        skew: 1,
                        duration: 1.8,
                        ease: "power3",
                        overwrite: true,
                        onUpdate: () => skewSetter(proxy.skew)
                    });
                }
            }
        });

        gsap.set(".skewElem", { transformOrigin: "right center", force3D: true });

    }, []);

    return (
        <div>
            <div className="page-wrapper">
                <header>Pin and scroll section horizontally only when necessary to reveal content</header>
                <section className="section">
                    <div className="container">
                        <ul className="items scrollx-section" style={{ display: 'flex', width: '200%' }}>
                            {
                                Array.from({ length: 7 }).map((_, i) => (
                                    <li className="item" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}><div className="ct">1</div></li>
                                ))
                            }
                        </ul>
                    </div>
                </section>
                <div className="spacer">spacer</div>
                <section className='next-sections'>
                    <div className="container">
                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit...</p>
                       
                    </div>
                </section>
                <div className="spacer">spacer</div>
            </div>
        </div>
    );
}
