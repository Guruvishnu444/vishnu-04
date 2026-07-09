import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

const SplitText = ({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  tag = 'p',
  onLetterAnimationComplete,
  repeatEvery = null // Pass a number in milliseconds to repeat animation (e.g., 30000 for 30 seconds)
}) => {
  const ref = useRef(null);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const intervalRef = useRef(null);
  const targetsRef = useRef(null);

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (document.fonts.status === 'loaded') {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    }
  }, []);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;
      if (animationCompletedRef.current) return;
      const el = ref.current;

      if (el._rbsplitInstance) {
        try {
          el._rbsplitInstance.revert();
        } catch (_) {
          /* noop */
        }
        el._rbsplitInstance = null;
      }

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
      const sign =
        marginValue === 0
          ? ''
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;

      let targets;
      const assignTargets = self => {
        if (splitType.includes('chars') && self.chars.length) targets = self.chars;
        if (!targets && splitType.includes('words') && self.words.length) targets = self.words;
        if (!targets && splitType.includes('lines') && self.lines.length) targets = self.lines;
        if (!targets) targets = self.chars || self.words || self.lines;
        targetsRef.current = targets;
      };

      // Fixes gradient "banding": if the wrapper uses bg-clip-text with a
      // gradient background, each split char normally clips its own slice
      // of the gradient (since each char is its own element). This repaints
      // every char with the SAME full-width gradient, shifted into place,
      // so the text reads as one continuous gradient sweep instead of
      // repeating per letter.
      const applyContinuousGradient = () => {
        const computed = window.getComputedStyle(el);
        const isClipText =
          computed.webkitBackgroundClip === 'text' || computed.backgroundClip === 'text';
        if (!isClipText || !targets || !targets.length) return;

        const parentRect = el.getBoundingClientRect();
        const bgImage = computed.backgroundImage;

        targets.forEach(node => {
          const rect = node.getBoundingClientRect();
          const offsetX = rect.left - parentRect.left;
          const offsetY = rect.top - parentRect.top;
          node.style.backgroundImage = bgImage;
          node.style.backgroundSize = `${parentRect.width}px ${parentRect.height}px`;
          node.style.backgroundPosition = `-${offsetX}px -${offsetY}px`;
          node.style.webkitBackgroundClip = 'text';
          node.style.backgroundClip = 'text';
          node.style.color = 'transparent';
          node.style.webkitTextFillColor = 'transparent';
        });
      };

      const playAnimation = () => {
        if (!targetsRef.current) return;
        
        gsap.fromTo(
          targetsRef.current,
          { ...from },
          {
            ...to,
            duration,
            ease,
            stagger: delay / 1000,
            willChange: 'transform, opacity',
            force3D: true
          }
        );
      };

      const splitInstance = new GSAPSplitText(el, {
        type: splitType,
        smartWrap: true,
        autoSplit: splitType === 'lines',
        linesClass: 'split-line',
        wordsClass: 'split-word',
        charsClass: 'split-char',
        reduceWhiteSpace: false,
        onSplit: self => {
          assignTargets(self);
          applyContinuousGradient();

          const tween = gsap.fromTo(
            targets,
            { ...from },
            {
              ...to,
              duration,
              ease,
              stagger: delay / 1000,
              scrollTrigger: {
                trigger: el,
                start,
                once: true,
                fastScrollEnd: true,
                anticipatePin: 0.4
              },
              onComplete: () => {
                animationCompletedRef.current = true;
                onCompleteRef.current?.();
                
                // Start repeating animation if repeatEvery is specified
                if (repeatEvery && repeatEvery > 0) {
                  intervalRef.current = setInterval(() => {
                    playAnimation();
                  }, repeatEvery);
                }
              },
              willChange: 'transform, opacity',
              force3D: true
            }
          );
          return tween;
        }
      });

      el._rbsplitInstance = splitInstance;

      return () => {
        // Clear interval on cleanup
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        ScrollTrigger.getAll().forEach(st => {
          if (st.trigger === el) st.kill();
        });
        try {
          splitInstance.revert();
        } catch (_) {
          /* noop */
        }
        el._rbsplitInstance = null;
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded,
        repeatEvery
      ],
      scope: ref
    }
  );

  const renderTag = () => {
    const style = {
      textAlign,
      overflow: 'hidden',
      display: 'inline-block',
      whiteSpace: 'normal',
      wordWrap: 'break-word',
      willChange: 'transform, opacity'
    };
    const classes = `split-parent ${className}`;
    const Tag = tag || 'p';

    return (
      <Tag ref={ref} style={style} className={classes}>
        {text}
      </Tag>
    );
  };
  return renderTag();
};

export default SplitText;