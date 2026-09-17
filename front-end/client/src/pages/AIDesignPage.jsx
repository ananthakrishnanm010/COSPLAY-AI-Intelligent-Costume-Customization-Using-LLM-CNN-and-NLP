import { useEffect, useRef, useState } from 'react';
import './AIDesignPage.css';
import SizeAdjuster from '../components/size-adjuster/SizeAdjuster';

function AIDesignPage() {

    // ==========================================
    // CONVERSATION
    // ==========================================

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef(null);


    // ==========================================
    // DESIGN REQUIREMENTS
    // ==========================================

    const [designRequirements, setDesignRequirements] = useState({
        garment: null,
        color: null,
        fit: null,
        design: null,
        style: null,
        placement: null,

        // SIZE
        sizeType: null,
        referenceBrand: null,
        referenceSize: null,
        sizeSatisfied: null,
        sizeAdjusted: false,

        // SIZE SLIDER ADJUSTMENTS
        adjustments: {
            chest: 0,
            waist: 0,
            shoulder: 0,
            length: 0,
            sleeve: 0,
        },

        // CUSTOM MEASUREMENTS
        measurements: {
            chest: null,
            waist: null,
            shoulder: null,
            length: null,
        },
    });


    // ==========================================
    // CONVERSATION STATUS
    // ==========================================

    const [conversationStatus, setConversationStatus] =
        useState('welcome');


    // ==========================================
    // SIZE ADJUSTER
    // ==========================================

    const [showSizeAdjuster, setShowSizeAdjuster] =
        useState(false);


    // ==========================================
    // CONFIRMATION / CHANGE / GENERATION
    // ==========================================

    const [showConfirmation, setShowConfirmation] =
        useState(false);

    const [isGenerating, setIsGenerating] =
        useState(false);

    const [changeMode, setChangeMode] =
        useState(false);

    const [pendingChange, setPendingChange] =
        useState(null);

    const [generationStep, setGenerationStep] =
        useState(0);

    const [generationComplete, setGenerationComplete] =
        useState(false);


    // ==========================================
    // AUTO SCROLL
    // ==========================================

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth',
        });
    }, [
        messages,
        isTyping,
        showSizeAdjuster,
        isGenerating,
    ]);


    // ==========================================
    // EXTRACT INFORMATION
    // ==========================================

    const extractInformation = (
        userMessage,
        currentRequirements
    ) => {

        const message = userMessage
            .toLowerCase()
            .trim()
            .replace(/[’‘]/g, "'");


        const updatedRequirements = {
            ...currentRequirements,

            adjustments: {
                ...currentRequirements.adjustments,
            },

            measurements: {
                ...currentRequirements.measurements,
            },
        };


        // ==========================================
        // GARMENT
        // ==========================================

        if (
            message.includes('t-shirt') ||
            message.includes('tshirt') ||
            message.includes('tee')
        ) {
            updatedRequirements.garment = 'T-shirt';
        }

        else if (message.includes('hoodie')) {
            updatedRequirements.garment = 'Hoodie';
        }

        else if (message.includes('jacket')) {
            updatedRequirements.garment = 'Jacket';
        }

        else if (message.includes('coat')) {
            updatedRequirements.garment = 'Coat';
        }

        else if (message.includes('shirt')) {
            updatedRequirements.garment = 'Shirt';
        }

        else if (message.includes('dress')) {
            updatedRequirements.garment = 'Dress';
        }

        else if (
            message.includes('pants') ||
            message.includes('trousers')
        ) {
            updatedRequirements.garment = 'Pants';
        }

        else if (message.includes('skirt')) {
            updatedRequirements.garment = 'Skirt';
        }


        // ==========================================
        // COLOR
        // ==========================================

        const colors = [
            'black',
            'white',
            'red',
            'blue',
            'green',
            'yellow',
            'orange',
            'purple',
            'pink',
            'grey',
            'gray',
            'brown',
            'beige',
            'navy',
            'maroon',
            'cream',
        ];

        for (const color of colors) {

            if (message.includes(color)) {

                updatedRequirements.color =
                    color === 'gray'
                        ? 'grey'
                        : color;

                break;
            }
        }


        // ==========================================
        // FIT
        // ==========================================

        if (
            message.includes('oversized') ||
            message.includes('oversize') ||
            message.includes('baggy') ||
            message.includes('loose fit') ||
            message.includes('loose-fitting') ||
            message.includes('loose fitting') ||
            /\bloose\b/.test(message)
        ) {
            updatedRequirements.fit =
                'Oversized / Loose';
        }

        else if (
            message.includes('slim fit') ||
            message.includes('slim')
        ) {
            updatedRequirements.fit = 'Slim';
        }

        else if (
            message.includes('regular fit') ||
            message.includes('regular')
        ) {
            updatedRequirements.fit = 'Regular';
        }

        else if (
            message.includes('relaxed') ||
            message.includes('comfortable fit')
        ) {
            updatedRequirements.fit = 'Relaxed';
        }


        // ==========================================
        // STYLE
        // ==========================================

        if (message.includes('anime')) {
            updatedRequirements.style =
                'Anime-inspired';
        }

        else if (message.includes('cyberpunk')) {
            updatedRequirements.style =
                'Cyberpunk';
        }

        else if (message.includes('futuristic')) {
            updatedRequirements.style =
                'Futuristic';
        }

        else if (
            message.includes('realistic') ||
            message.includes('photorealistic')
        ) {
            updatedRequirements.style =
                'Realistic';
        }

        else if (message.includes('tribal')) {
            updatedRequirements.style =
                'Tribal';
        }

        else if (
            message.includes('minimal') ||
            message.includes('minimalist')
        ) {
            updatedRequirements.style =
                'Minimal';
        }

        else if (message.includes('cartoon')) {
            updatedRequirements.style =
                'Cartoon';
        }

        else if (
            message.includes('graffiti') ||
            message.includes('street art')
        ) {
            updatedRequirements.style =
                'Graffiti / Street Art';
        }


        // ==========================================
        // DESIGN
        // ==========================================

        if (message.includes('dragon')) {
            updatedRequirements.design =
                'Dragon';
        }

        else if (message.includes('skull')) {
            updatedRequirements.design =
                'Skull';
        }

        else if (
            message.includes('flame') ||
            message.includes('fire')
        ) {
            updatedRequirements.design =
                'Flame';
        }

        else if (
            message.includes('flower') ||
            message.includes('floral')
        ) {
            updatedRequirements.design =
                'Flower';
        }

        else if (message.includes('logo')) {
            updatedRequirements.design =
                'Logo';
        }

        else if (message.includes('samurai')) {
            updatedRequirements.design =
                'Samurai';
        }

        else if (message.includes('wolf')) {
            updatedRequirements.design =
                'Wolf';
        }

        else if (message.includes('tiger')) {
            updatedRequirements.design =
                'Tiger';
        }

        else if (message.includes('phoenix')) {
            updatedRequirements.design =
                'Phoenix';
        }


        // ==========================================
        // PLACEMENT
        // ==========================================

        if (
            message.includes('front') &&
            message.includes('back')
        ) {
            updatedRequirements.placement =
                'Front and Back';
        }

        else if (message.includes('back')) {
            updatedRequirements.placement =
                'Back';
        }

        else if (message.includes('sleeve')) {
            updatedRequirements.placement =
                'Sleeve';
        }

        else if (message.includes('chest')) {
            updatedRequirements.placement =
                'Front / Chest';
        }

        else if (message.includes('front')) {
            updatedRequirements.placement =
                'Front';
        }


        // ==========================================
        // CUSTOM SIZE
        // ==========================================

        if (
            message.includes('custom size') ||
            message.includes('custom measurements') ||
            message.includes('custom fit') ||
            message === 'custom'
        ) {
            updatedRequirements.sizeType =
                'custom';

            updatedRequirements.sizeSatisfied =
                false;
        }


        // ==========================================
        // REFERENCE BRAND
        // ==========================================

        const knownBrands = [
            {
                pattern: /\blevi'?s\b|\blevis\b/,
                name: "Levi's",
            },
            {
                pattern: /\bnike\b/,
                name: 'Nike',
            },
            {
                pattern: /\badidas\b/,
                name: 'Adidas',
            },
            {
                pattern: /\bpuma\b/,
                name: 'Puma',
            },
            {
                pattern: /\bh&m\b/,
                name: 'H&M',
            },
            {
                pattern: /\bzara\b/,
                name: 'Zara',
            },
            {
                pattern: /\buniqlo\b/,
                name: 'Uniqlo',
            },
            {
                pattern: /\broadster\b/,
                name: 'Roadster',
            },
            {
                pattern: /\bhrx\b/,
                name: 'HRX',
            },
            {
                pattern: /\bwrangler\b/,
                name: 'Wrangler',
            },
            {
                pattern: /\bgap\b/,
                name: 'Gap',
            },
        ];

        for (const brand of knownBrands) {

            if (brand.pattern.test(message)) {

                updatedRequirements.referenceBrand =
                    brand.name;

                break;
            }
        }


        // ==========================================
        // REFERENCE SIZE
        // ==========================================

        const referenceSizeMatch =
            message.match(
                /\b(xs|s|m|l|xl|xxl|xxxl|2xl|3xl|extra small|small|medium|large|extra large|xx-large)\b/
            );


        if (referenceSizeMatch) {

            let size =
                referenceSizeMatch[1];


            if (size === 'extra small') {
                size = 'XS';
            }

            else if (size === 'small') {
                size = 'S';
            }

            else if (size === 'medium') {
                size = 'M';
            }

            else if (size === 'large') {
                size = 'L';
            }

            else if (size === 'extra large') {
                size = 'XL';
            }

            else if (
                size === 'xx-large' ||
                size === '2xl'
            ) {
                size = 'XXL';
            }

            else if (size === '3xl') {
                size = 'XXXL';
            }

            else {
                size = size.toUpperCase();
            }


            updatedRequirements.referenceSize =
                size;


            if (!updatedRequirements.sizeType) {
                updatedRequirements.sizeType =
                    size;
            }
        }


        // ==========================================
        // CUSTOM MEASUREMENTS
        // ==========================================

        const chestMatch =
            message.match(
                /chest\s*[:\-]?\s*(\d+(?:\.\d+)?)/
            );

        const waistMatch =
            message.match(
                /waist\s*[:\-]?\s*(\d+(?:\.\d+)?)/
            );

        const shoulderMatch =
            message.match(
                /shoulder\s*[:\-]?\s*(\d+(?:\.\d+)?)/
            );

        const lengthMatch =
            message.match(
                /length\s*[:\-]?\s*(\d+(?:\.\d+)?)/
            );


        if (chestMatch) {

            updatedRequirements.measurements.chest =
                Number(chestMatch[1]);

            updatedRequirements.sizeType =
                'custom';
        }


        if (waistMatch) {

            updatedRequirements.measurements.waist =
                Number(waistMatch[1]);

            updatedRequirements.sizeType =
                'custom';
        }


        if (shoulderMatch) {

            updatedRequirements.measurements.shoulder =
                Number(shoulderMatch[1]);

            updatedRequirements.sizeType =
                'custom';
        }


        if (lengthMatch) {

            updatedRequirements.measurements.length =
                Number(lengthMatch[1]);

            updatedRequirements.sizeType =
                'custom';
        }


        return updatedRequirements;
    };


    // ==========================================
    // DETERMINE NEXT QUESTION
    // ==========================================

    const getNextQuestion = (requirements) => {

        // GARMENT

        if (!requirements.garment) {

            return {
                key: 'garment',

                question:
                    'What type of clothing would you like to create? For example, a T-shirt, hoodie, jacket, or full cosplay outfit.',
            };
        }


        // COLOR

        if (!requirements.color) {

            return {
                key: 'color',

                question:
                    'What color or color combination would you like for the design?',
            };
        }


        // FIT

        if (!requirements.fit) {

            return {
                key: 'fit',

                question:
                    'What kind of fit would you like — regular, slim, oversized, or something else?',
            };
        }


        // DESIGN

        if (!requirements.design) {

            return {
                key: 'design',

                question:
                    'What design or artwork would you like on the clothing?',
            };
        }


        // STYLE

        if (!requirements.style) {

            return {
                key: 'style',

                question:
                    'What visual style would you like for the design? For example, anime-inspired, cyberpunk, realistic, futuristic, or something else.',
            };
        }


        // PLACEMENT

        if (!requirements.placement) {

            return {
                key: 'placement',

                question:
                    'Where would you like the design to appear — front, back, or both?',
            };
        }


        // ==========================================
        // SIZE REFERENCE
        // ==========================================

        if (
            requirements.sizeType !== 'custom'
        ) {

            if (
                !requirements.referenceBrand ||
                !requirements.referenceSize
            ) {

                return {
                    key: 'sizeReference',

                    question:
                        "What size do you normally wear for this type of clothing? If possible, tell me a brand and size you already wear comfortably, for example: Levi's Small.",
                };
            }
        }


        // ==========================================
        // CUSTOM SIZE
        // ==========================================

        if (
            requirements.sizeType === 'custom' &&
            !requirements.sizeAdjusted
        ) {

            return {
                key: 'sizeAdjustment',

                question:
                    'No problem. I can help you adjust the fit visually using the size adjustment panel.',
            };
        }


        // ==========================================
        // SIZE SATISFACTION
        // ==========================================

        if (
            requirements.sizeSatisfied === null
        ) {

            return {
                key: 'sizeSatisfaction',

                question:
                    `Are you satisfied with the fit of your ${requirements.referenceBrand} ${requirements.referenceSize}, or would you like to make some adjustments?`,
            };
        }


        // ==========================================
        // SIZE ADJUSTMENT
        // ==========================================

        if (
            requirements.sizeSatisfied === false &&
            !requirements.sizeAdjusted
        ) {

            return {
                key: 'sizeAdjustment',

                question:
                    'No problem. I can help you adjust the fit visually using the size adjustment panel.',
            };
        }


        return null;
    };


    // ==========================================
    // DETECT SIZE SATISFACTION
    // ==========================================

    const detectSizeSatisfaction = (
        userMessage
    ) => {

        const message =
            userMessage
                .toLowerCase()
                .trim();


        const negativeWords = [
            'no',
            'not satisfied',
            'not happy',
            "don't like",
            'adjust',
            'adjustment',
            'change',
            'different',
            'looser',
            'tighter',
            'bigger',
            'smaller',
            'longer',
            'shorter',
        ];


        const positiveWords = [
            'yes',
            'satisfied',
            'happy',
            'good',
            'perfect',
            'fine',
            'comfortable',
            'keep it',
            'use this',
            'same',
            'no changes',
        ];


        const hasNegative =
            negativeWords.some(
                (word) =>
                    message.includes(word)
            );


        const hasPositive =
            positiveWords.some(
                (word) =>
                    message.includes(word)
            );


        if (hasNegative) {
            return false;
        }


        if (hasPositive) {
            return true;
        }


        return null;
    };


    // ==========================================
    // PROCESS USER MESSAGE
    // ==========================================

    const processUserMessage = (
        userMessage,
        currentRequirements
    ) => {

        let updatedRequirements =
            extractInformation(
                userMessage,
                currentRequirements
            );


        // ==========================================
        // CUSTOM SIZE
        // ==========================================

        if (
            updatedRequirements.sizeType ===
            'custom'
        ) {

            updatedRequirements = {
                ...updatedRequirements,

                sizeSatisfied: false,

                sizeAdjusted: false,
            };
        }


        // ==========================================
        // SIZE SATISFACTION
        // ==========================================

        if (
            updatedRequirements.referenceSize &&
            updatedRequirements.sizeSatisfied === null
        ) {

            const satisfaction =
                detectSizeSatisfaction(
                    userMessage
                );


            if (satisfaction !== null) {

                updatedRequirements = {
                    ...updatedRequirements,

                    sizeSatisfied:
                        satisfaction,
                };
            }
        }


        // ==========================================
        // USER WANTS ADJUSTMENT
        // ==========================================

        if (
            updatedRequirements.sizeSatisfied ===
            false
        ) {

            updatedRequirements = {
                ...updatedRequirements,

                sizeAdjusted: false,
            };
        }


        const nextQuestion =
            getNextQuestion(
                updatedRequirements
            );


        return {
            updatedRequirements,
            nextQuestion,
        };
    };


    // ==========================================
    // HANDLE SIZE ADJUSTMENT SAVE
    // ==========================================

    const handleSizeAdjustmentSave = (
        adjustments
    ) => {

        const finalRequirements = {
            ...designRequirements,

            sizeAdjusted: true,

            sizeSatisfied: false,

            adjustments: {
                ...adjustments,
            },
        };


        setDesignRequirements(
            finalRequirements
        );

        setShowSizeAdjuster(false);

        setConversationStatus('ready');

        setChangeMode(false);

        setPendingChange(null);

        setShowConfirmation(true);


        setMessages(
            (previousMessages) => [
                ...previousMessages,

                {
                    id: Date.now(),
                    sender: 'ai',
                    text:
                        'Perfect! I have saved your adjusted fit. Your size preferences are now part of the design.',
                },

                {
                    id: Date.now() + 1,
                    sender: 'ai',
                    text:
                        'I now have everything I need to prepare your cosplay design. 🎨',
                },

                {
                    id: Date.now() + 2,
                    sender: 'ai',
                    type: 'summary',
                    requirements:
                        finalRequirements,
                },

                {
                    id: Date.now() + 3,
                    sender: 'ai',
                    text:
                        'Please review the requirements above. Once everything looks good, we can move on to generating your design.',
                },
            ]
        );
    };


    // ==========================================
    // HANDLE MAKE CHANGES
    // ==========================================

    const handleMakeChanges = () => {

        setShowConfirmation(false);

        setChangeMode(true);

        setPendingChange(null);

        setConversationStatus('collecting');


        setMessages(
            (previousMessages) => [
                ...previousMessages,

                {
                    id: Date.now(),
                    sender: 'ai',
                    text:
                        'Of course! What would you like to change? You can change the color, fit, design, style, placement, size adjustments, or any other part of the concept.',
                },
            ]
        );
    };


    // ==========================================
    // HANDLE GENERATE DESIGN
    // ==========================================

    const handleGenerateDesign = () => {

        setShowConfirmation(false);

        setChangeMode(false);

        setPendingChange(null);

        setIsGenerating(true);

        setGenerationStep(0);

        setGenerationComplete(false);


        setMessages(
            (previousMessages) => [
                ...previousMessages,

                {
                    id: Date.now(),
                    sender: 'ai',
                    text:
                        'Perfect! Your design requirements are confirmed. I’m preparing your design now. 🎨',
                },
            ]
        );
    };


    // ==========================================
    // HANDLE CHANGE REQUEST
    // ==========================================

    const handleChangeRequest = (
        userMessage
    ) => {

        const message =
            userMessage
                .toLowerCase()
                .trim();


        // ==========================================
        // AVAILABLE COLORS
        // ==========================================

        const colors = [
            'black',
            'white',
            'red',
            'blue',
            'green',
            'yellow',
            'orange',
            'purple',
            'pink',
            'grey',
            'gray',
            'brown',
            'beige',
            'navy',
            'maroon',
            'cream',
        ];


        // ==========================================
        // AVAILABLE FITS
        // ==========================================

        const fits = {

            oversized:
                'Oversized / Loose',

            oversize:
                'Oversized / Loose',

            baggy:
                'Oversized / Loose',

            loose:
                'Oversized / Loose',

            'slim fit':
                'Slim',

            slim:
                'Slim',

            'regular fit':
                'Regular',

            regular:
                'Regular',

            relaxed:
                'Relaxed',
        };


        // ==========================================
        // AVAILABLE STYLES
        // ==========================================

        const styles = [
            'anime',
            'cyberpunk',
            'futuristic',
            'realistic',
            'photorealistic',
            'tribal',
            'minimal',
            'minimalist',
            'cartoon',
            'graffiti',
            'street art',
        ];


        // ==========================================
        // AVAILABLE DESIGNS
        // ==========================================

        const designs = [
            'dragon',
            'skull',
            'flame',
            'fire',
            'flower',
            'floral',
            'logo',
            'samurai',
            'wolf',
            'tiger',
            'phoenix',
        ];


        // ==========================================
        // FINISH ONE CHANGE
        // ==========================================

        const finishChange = (
            updatedRequirements,
            response
        ) => {

            setDesignRequirements(
                updatedRequirements
            );

            setPendingChange(null);

            setChangeMode(true);

            setShowConfirmation(false);


            setMessages(
                (previousMessages) => [
                    ...previousMessages,

                    {
                        id: Date.now(),
                        sender: 'ai',
                        text: response,
                    },

                    {
                        id: Date.now() + 1,
                        sender: 'ai',
                        text:
                            'Would you like to change anything else? Type color, fit, design, style, placement, or size adjustments. If everything is good, type “done”.',
                    },
                ]
            );
        };


        // ==========================================
        // FINISH CHANGE MODE
        // ==========================================

        if (
            message === 'done' ||
            message === 'finish' ||
            message === 'finished' ||
            message === 'no' ||
            message === 'nope' ||
            message === 'nothing' ||
            message === 'nothing else' ||
            message === 'looks good'
        ) {

            setChangeMode(false);

            setPendingChange(null);

            setConversationStatus('ready');

            setShowConfirmation(true);


            setMessages(
                (previousMessages) => [
                    ...previousMessages,

                    {
                        id: Date.now(),
                        sender: 'ai',
                        text:
                            'Perfect! I’ve updated the design requirements. Please review the updated summary below.',
                    },

                    {
                        id: Date.now() + 1,
                        sender: 'ai',
                        type: 'summary',
                        requirements:
                            designRequirements,
                    },

                    {
                        id: Date.now() + 2,
                        sender: 'ai',
                        text:
                            'Once everything looks good, you can generate your design.',
                    },
                ]
            );

            return;
        }


        // ==========================================
        // WAITING FOR COLOR
        // ==========================================

        if (pendingChange === 'color') {

            const found =
                colors.find(
                    (color) =>
                        message.includes(color)
                );


            if (found) {

                const formatted =
                    found === 'grey' ||
                        found === 'gray'
                        ? 'Grey'
                        : found
                            .charAt(0)
                            .toUpperCase() +
                        found.slice(1);


                finishChange(

                    {
                        ...designRequirements,

                        color: formatted,
                    },

                    `Got it! I’ll change the color to ${formatted}. 🎨`
                );

                return;
            }


            setMessages(
                (previousMessages) => [
                    ...previousMessages,

                    {
                        id: Date.now(),
                        sender: 'ai',
                        text:
                            'What color would you like instead? For example: black, white, red, blue, navy, or cream.',
                    },
                ]
            );

            return;
        }


        // ==========================================
        // WAITING FOR FIT
        // ==========================================

        if (pendingChange === 'fit') {

            const found =
                Object.keys(fits).find(
                    (fit) =>
                        message.includes(fit)
                );


            if (found) {

                finishChange(

                    {
                        ...designRequirements,

                        fit: fits[found],
                    },

                    `Got it! I’ve changed the fit to ${fits[found]}.`
                );

                return;
            }


            setMessages(
                (previousMessages) => [
                    ...previousMessages,

                    {
                        id: Date.now(),
                        sender: 'ai',
                        text:
                            'What fit would you like? For example: oversized, slim, regular, or relaxed.',
                    },
                ]
            );

            return;
        }


        // ==========================================
        // WAITING FOR DESIGN
        // ==========================================

        if (pendingChange === 'design') {

            const found =
                designs.find(
                    (design) =>
                        message.includes(design)
                );


            if (found) {

                let formatted =
                    found
                        .charAt(0)
                        .toUpperCase() +
                    found.slice(1);


                if (
                    found === 'fire' ||
                    found === 'flame'
                ) {
                    formatted = 'Flame';
                }


                if (found === 'floral') {
                    formatted = 'Flower';
                }


                finishChange(

                    {
                        ...designRequirements,

                        design: formatted,
                    },

                    `Perfect! I’ve changed the design to ${formatted}.`
                );

                return;
            }


            setMessages(
                (previousMessages) => [
                    ...previousMessages,

                    {
                        id: Date.now(),
                        sender: 'ai',
                        text:
                            'What design would you like instead? For example: dragon, skull, flame, wolf, tiger, or phoenix.',
                    },
                ]
            );

            return;
        }


        // ==========================================
        // WAITING FOR STYLE
        // ==========================================

        if (pendingChange === 'style') {

            const found =
                styles.find(
                    (style) =>
                        message.includes(style)
                );


            if (found) {

                let formatted =
                    found
                        .charAt(0)
                        .toUpperCase() +
                    found.slice(1);


                if (found === 'anime') {
                    formatted =
                        'Anime-inspired';
                }


                if (found === 'street art') {
                    formatted =
                        'Graffiti / Street Art';
                }


                finishChange(

                    {
                        ...designRequirements,

                        style: formatted,
                    },

                    `Great! I’ve changed the style to ${formatted}.`
                );

                return;
            }


            setMessages(
                (previousMessages) => [
                    ...previousMessages,

                    {
                        id: Date.now(),
                        sender: 'ai',
                        text:
                            'What style would you like? For example: anime, cyberpunk, futuristic, realistic, or graffiti.',
                    },
                ]
            );

            return;
        }


        // ==========================================
        // WAITING FOR PLACEMENT
        // ==========================================

        if (pendingChange === 'placement') {

            if (
                message.includes('front') &&
                message.includes('back')
            ) {

                finishChange(

                    {
                        ...designRequirements,

                        placement:
                            'Front and Back',
                    },

                    'Got it! I’ve changed the placement to Front and Back.'
                );

                return;
            }


            if (message.includes('back')) {

                finishChange(

                    {
                        ...designRequirements,

                        placement: 'Back',
                    },

                    'Got it! I’ve changed the placement to Back.'
                );

                return;
            }


            if (message.includes('sleeve')) {

                finishChange(

                    {
                        ...designRequirements,

                        placement: 'Sleeve',
                    },

                    'Got it! I’ve changed the placement to Sleeve.'
                );

                return;
            }


            if (message.includes('chest')) {

                finishChange(

                    {
                        ...designRequirements,

                        placement:
                            'Front / Chest',
                    },

                    'Got it! I’ve changed the placement to Front / Chest.'
                );

                return;
            }


            if (message.includes('front')) {

                finishChange(

                    {
                        ...designRequirements,

                        placement: 'Front',
                    },

                    'Got it! I’ve changed the placement to Front.'
                );

                return;
            }


            setMessages(
                (previousMessages) => [
                    ...previousMessages,

                    {
                        id: Date.now(),
                        sender: 'ai',
                        text:
                            'Where should the design be placed? For example: front, back, chest, sleeve, or front and back.',
                    },
                ]
            );

            return;
        }


        // ==========================================
        // USER SAYS SIZE / MEASUREMENTS
        // ==========================================

        // Allow the user to reopen the size adjustment panel
        // even after they have already adjusted the size once.
        if (
            message.includes('size adjustment') ||
            message.includes('size adjustments') ||
            message.includes('measurements') ||
            message.includes('measurement') ||
            message.includes('sizing') ||
            message.includes('fit measurements')
        ) {

            setChangeMode(false);

            setPendingChange(null);

            setShowConfirmation(false);

            setShowSizeAdjuster(true);

            setConversationStatus('collecting');

            setMessages(
                (previousMessages) => [
                    ...previousMessages,

                    {
                        id: Date.now(),
                        sender: 'ai',
                        text:
                            "Sure! Let's adjust your measurements again. You can modify the fit using the sliders below.",
                    },
                ]
            );

            return;
        }


        // ==========================================
        // USER SAYS COLOR
        // ==========================================

        if (
            message.includes('color') ||
            message.includes('colour')
        ) {

            setPendingChange('color');


            setMessages(
                (previousMessages) => [
                    ...previousMessages,

                    {
                        id: Date.now(),
                        sender: 'ai',
                        text:
                            'Sure! What color would you like instead? 🎨',
                    },
                ]
            );

            return;
        }


        // ==========================================
        // USER SAYS FIT
        // ==========================================

        if (message.includes('fit')) {

            setPendingChange('fit');


            setMessages(
                (previousMessages) => [
                    ...previousMessages,

                    {
                        id: Date.now(),
                        sender: 'ai',
                        text:
                            'Sure! What fit would you like instead? For example: oversized, slim, regular, or relaxed.',
                    },
                ]
            );

            return;
        }


        // ==========================================
        // USER SAYS DESIGN
        // ==========================================

        if (
            message.includes('design') ||
            message.includes('pattern')
        ) {

            setPendingChange('design');


            setMessages(
                (previousMessages) => [
                    ...previousMessages,

                    {
                        id: Date.now(),
                        sender: 'ai',
                        text:
                            'Sure! What design would you like instead?',
                    },
                ]
            );

            return;
        }


        // ==========================================
        // USER SAYS STYLE
        // ==========================================

        if (message.includes('style')) {

            setPendingChange('style');


            setMessages(
                (previousMessages) => [
                    ...previousMessages,

                    {
                        id: Date.now(),
                        sender: 'ai',
                        text:
                            'Sure! What style would you like instead?',
                    },
                ]
            );

            return;
        }


        // ==========================================
        // USER SAYS PLACEMENT
        // ==========================================

        if (
            message.includes('placement') ||
            message.includes('position')
        ) {

            setPendingChange('placement');


            setMessages(
                (previousMessages) => [
                    ...previousMessages,

                    {
                        id: Date.now(),
                        sender: 'ai',
                        text:
                            'Sure! Where would you like the design placed?',
                    },
                ]
            );

            return;
        }


        // ==========================================
        // UNKNOWN CHANGE
        // ==========================================

        setMessages(
            (previousMessages) => [
                ...previousMessages,

                {
                    id: Date.now(),
                    sender: 'ai',
                    text:
                        'Sure! Tell me what part of the design you would like to change — color, fit, design, style, placement, or size adjustments.',
                },
            ]
        );
    };


    // ==========================================
    // MOCK DESIGN GENERATION
    // ==========================================

    useEffect(() => {

        if (!isGenerating) {
            return;
        }


        const steps = [
            'Analyzing your concept...',
            'Applying garment...',
            'Applying color and design...',
            'Applying your selected style...',
            'Applying size adjustments...',
            'Generating your design...',
        ];


        let currentStep = 0;


        setGenerationStep(0);

        setGenerationComplete(false);


        const interval =
            setInterval(() => {

                currentStep += 1;


                if (
                    currentStep <
                    steps.length
                ) {

                    setGenerationStep(
                        currentStep
                    );

                }

                else {

                    clearInterval(interval);


                    setGenerationComplete(
                        true
                    );

                    setIsGenerating(false);


                    setMessages(
                        (previousMessages) => [
                            ...previousMessages,

                            {
                                id: Date.now(),
                                sender: 'ai',
                                text:
                                    'Your cosplay design is ready! ✨',
                            },

                            {
                                id: Date.now() + 1,
                                sender: 'ai',
                                type:
                                    'generated-design',
                                requirements:
                                    designRequirements,
                            },
                        ]
                    );
                }

            }, 1200);


        return () =>
            clearInterval(interval);

    }, [isGenerating]);


    // ==========================================
    // RENDER GENERATED DESIGN
    // ==========================================

    const renderGeneratedDesign = (
        requirements
    ) => {

        const colorMap = {

            black: '#111111',

            white: '#f5f5f5',

            red: '#c62828',

            blue: '#2563eb',

            green: '#16803c',

            yellow: '#eab308',

            orange: '#ea580c',

            purple: '#7c3aed',

            pink: '#ec4899',

            grey: '#6b7280',

            brown: '#78350f',

            beige: '#d6c3a5',

            navy: '#172554',

            maroon: '#7f1d1d',

            cream: '#f5f0df',
        };


        const shirtColor =
            colorMap[
            String(
                requirements?.color || ''
            ).toLowerCase()
            ] || '#111111';


        const designText =
            requirements?.design ||
            'Custom Design';


        return (

            <div className="generated-design-card">


                {/* HEADER */}

                <div className="generated-design-header">

                    <div>

                        <span className="generated-design-label">
                            AI GENERATED CONCEPT
                        </span>


                        <h3>
                            Your Cosplay Design
                        </h3>


                        <p>
                            Your concept has been
                            generated based on the
                            requirements you provided.
                        </p>

                    </div>


                    <div className="generated-design-status">
                        ✓ Ready
                    </div>

                </div>


                {/* PREVIEW */}

                <div className="generated-design-preview">


                    <div className="generated-shirt">

                        <svg
                            viewBox="0 0 400 500"
                            className="generated-shirt-svg"
                        >

                            {/* SHADOW */}

                            <ellipse
                                cx="200"
                                cy="465"
                                rx="105"
                                ry="18"
                                fill="#dddddd"
                            />


                            {/* LEFT SLEEVE */}

                            <path
                                d="
                                    M105 100
                                    L35 145
                                    L75 220
                                    L125 190
                                    Z
                                "
                                fill={shirtColor}
                            />


                            {/* RIGHT SLEEVE */}

                            <path
                                d="
                                    M295 100
                                    L365 145
                                    L325 220
                                    L275 190
                                    Z
                                "
                                fill={shirtColor}
                            />


                            {/* MAIN SHIRT */}

                            <path
                                d="
                                    M105 90
                                    Q200 55 295 90
                                    L275 435
                                    Q200 460 125 435
                                    Z
                                "
                                fill={shirtColor}
                            />


                            {/* NECK */}

                            <path
                                d="
                                    M155 75
                                    Q200 115 245 75
                                    Q230 130 200 132
                                    Q170 130 155 75
                                "
                                fill="#ffffff"
                                opacity="0.15"
                            />


                            {/* DESIGN CIRCLE */}

                            <circle
                                cx="200"
                                cy="270"
                                r="75"
                                fill="none"
                                stroke="#ffffff"
                                strokeWidth="3"
                                opacity="0.35"
                            />


                            {/* DESIGN NAME */}

                            <text
                                x="200"
                                y="260"
                                textAnchor="middle"
                                fill="#ffffff"
                                fontSize="18"
                                fontWeight="700"
                                fontFamily="Arial, sans-serif"
                            >
                                {designText.substring(
                                    0,
                                    18
                                )}
                            </text>


                            <text
                                x="200"
                                y="288"
                                textAnchor="middle"
                                fill="#ffffff"
                                fontSize="11"
                                fontFamily="Arial, sans-serif"
                                opacity="0.8"
                            >
                                COSPLAY STUDIO
                            </text>

                        </svg>

                    </div>


                    {/* DESIGN INFORMATION */}

                    <div className="generated-design-info">


                        <div className="generated-info-row">

                            <span>
                                Garment
                            </span>

                            <strong>
                                {
                                    requirements?.garment ||
                                    'T-shirt'
                                }
                            </strong>

                        </div>


                        <div className="generated-info-row">

                            <span>
                                Color
                            </span>

                            <strong>
                                {
                                    requirements?.color ||
                                    'Custom'
                                }
                            </strong>

                        </div>


                        <div className="generated-info-row">

                            <span>
                                Fit
                            </span>

                            <strong>
                                {
                                    requirements?.fit ||
                                    'Custom'
                                }
                            </strong>

                        </div>


                        <div className="generated-info-row">

                            <span>
                                Style
                            </span>

                            <strong>
                                {
                                    requirements?.style ||
                                    'Custom'
                                }
                            </strong>

                        </div>


                        <div className="generated-info-row">

                            <span>
                                Placement
                            </span>

                            <strong>
                                {
                                    requirements?.placement ||
                                    'Front'
                                }
                            </strong>

                        </div>


                        <div className="generated-info-row">

                            <span>
                                Design
                            </span>

                            <strong>
                                {
                                    requirements?.design ||
                                    'Custom'
                                }
                            </strong>

                        </div>

                    </div>

                </div>


                {/* ACTION BUTTONS */}

                <div className="generated-design-actions">


                    <button
                        className="generated-secondary-button"
                        onClick={
                            handleMakeChanges
                        }
                    >
                        ✎ Make Changes
                    </button>


                    <button
                        className="generated-secondary-button"
                        onClick={() => {

                            setGenerationComplete(
                                false
                            );

                            setIsGenerating(
                                true
                            );

                            setGenerationStep(
                                0
                            );

                        }}
                    >
                        ↻ Regenerate
                    </button>


                    <button
                        className="generated-primary-button"
                        onClick={
                            startNewChat
                        }
                    >
                        ＋ Start New Design
                    </button>

                </div>

            </div>
        );
    };


    // ==========================================
    // SEND MESSAGE
    // ==========================================

    const sendMessage = () => {

        const trimmedInput =
            input.trim();


        if (
            !trimmedInput ||
            isTyping ||
            isGenerating
        ) {
            return;
        }


        // ==========================================
        // CHANGE MODE
        // ==========================================

        if (changeMode) {

            setMessages(
                (previousMessages) => [
                    ...previousMessages,

                    {
                        id: Date.now(),
                        sender: 'user',
                        text: trimmedInput,
                    },
                ]
            );


            setInput('');


            handleChangeRequest(
                trimmedInput
            );

            return;
        }


        // ==========================================
        // NORMAL CONVERSATION
        // ==========================================

        const userMessage = {

            id: Date.now(),

            sender: 'user',

            text: trimmedInput,
        };


        setMessages(
            (previousMessages) => [
                ...previousMessages,
                userMessage,
            ]
        );


        setInput('');

        setIsTyping(true);

        setConversationStatus(
            'collecting'
        );


        // ==========================================
        // PROCESS MESSAGE
        // ==========================================

        setTimeout(() => {

            setDesignRequirements(
                (currentRequirements) => {

                    const result =
                        processUserMessage(
                            trimmedInput,
                            currentRequirements
                        );


                    // ==================================
                    // SIZE ADJUSTMENT
                    // ==================================

                    if (
                        result.updatedRequirements
                            .sizeSatisfied ===
                        false &&

                        !result.updatedRequirements
                            .sizeAdjusted
                    ) {

                        setMessages(
                            (previousMessages) => [
                                ...previousMessages,

                                {
                                    id:
                                        Date.now() +
                                        1,

                                    sender: 'ai',

                                    text:
                                        "No problem. Let's adjust the fit visually so you don't need to know your exact measurements.",
                                },
                            ]
                        );


                        setShowSizeAdjuster(
                            true
                        );

                        setShowConfirmation(
                            false
                        );

                        setIsTyping(false);


                        return result.updatedRequirements;
                    }


                    // ==================================
                    // COMPLETE
                    // ==================================

                    if (
                        !result.nextQuestion
                    ) {

                        setConversationStatus(
                            'ready'
                        );

                        setShowConfirmation(
                            true
                        );


                        setMessages(
                            (previousMessages) => [
                                ...previousMessages,

                                {
                                    id:
                                        Date.now() +
                                        1,

                                    sender: 'ai',

                                    text:
                                        'Perfect! I have everything I need to create your design. 🎨',
                                },

                                {
                                    id:
                                        Date.now() +
                                        2,

                                    sender: 'ai',

                                    type: 'summary',

                                    requirements:
                                        result.updatedRequirements,
                                },

                                {
                                    id:
                                        Date.now() +
                                        3,

                                    sender: 'ai',

                                    text:
                                        'Please review the requirements above. Once everything looks good, we can move on to generating your design.',
                                },
                            ]
                        );


                        setIsTyping(false);


                        return result.updatedRequirements;
                    }


                    // ==================================
                    // NEXT QUESTION
                    // ==================================

                    setMessages(
                        (previousMessages) => [
                            ...previousMessages,

                            {
                                id:
                                    Date.now() +
                                    1,

                                sender: 'ai',

                                text:
                                    result.nextQuestion
                                        .question,
                            },
                        ]
                    );


                    setIsTyping(false);


                    return result.updatedRequirements;
                }
            );

        }, 900);
    };


    // ==========================================
    // ENTER KEY
    // ==========================================

    const handleKeyDown = (
        event
    ) => {

        if (
            event.key === 'Enter' &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();
        }
    };


    // ==========================================
    // NEW CHAT
    // ==========================================

    const startNewChat = () => {

        setMessages([]);

        setInput('');

        setIsTyping(false);

        setConversationStatus(
            'welcome'
        );

        setShowSizeAdjuster(false);

        setShowConfirmation(false);

        setIsGenerating(false);

        setChangeMode(false);

        setPendingChange(null);

        setGenerationStep(0);

        setGenerationComplete(false);


        setDesignRequirements({

            garment: null,

            color: null,

            fit: null,

            design: null,

            style: null,

            placement: null,


            sizeType: null,

            referenceBrand: null,

            referenceSize: null,

            sizeSatisfied: null,

            sizeAdjusted: false,


            adjustments: {

                chest: 0,

                waist: 0,

                shoulder: 0,

                length: 0,

                sleeve: 0,
            },


            measurements: {

                chest: null,

                waist: null,

                shoulder: null,

                length: null,
            },
        });
    };


    // ==========================================
    // RENDER SUMMARY
    // ==========================================

    const renderSummary = (
        requirements
    ) => {

        return (

            <div className="design-summary">


                <div className="summary-title">
                    Design Requirements
                </div>


                {/* GARMENT */}

                <div className="summary-item">

                    <span>
                        Garment
                    </span>

                    <strong>
                        {
                            requirements.garment ||
                            'Not specified'
                        }
                    </strong>

                </div>


                {/* COLOR */}

                <div className="summary-item">

                    <span>
                        Color
                    </span>

                    <strong>
                        {
                            requirements.color ||
                            'Not specified'
                        }
                    </strong>

                </div>


                {/* FIT */}

                <div className="summary-item">

                    <span>
                        Fit
                    </span>

                    <strong>
                        {
                            requirements.fit ||
                            'Not specified'
                        }
                    </strong>

                </div>


                {/* DESIGN */}

                <div className="summary-item">

                    <span>
                        Design
                    </span>

                    <strong>
                        {
                            requirements.design ||
                            'Not specified'
                        }
                    </strong>

                </div>


                {/* STYLE */}

                <div className="summary-item">

                    <span>
                        Style
                    </span>

                    <strong>
                        {
                            requirements.style ||
                            'Not specified'
                        }
                    </strong>

                </div>


                {/* PLACEMENT */}

                <div className="summary-item">

                    <span>
                        Placement
                    </span>

                    <strong>
                        {
                            requirements.placement ||
                            'Not specified'
                        }
                    </strong>

                </div>


                {/* REFERENCE SIZE */}

                <div className="summary-item">

                    <span>
                        Reference Size
                    </span>

                    <strong>

                        {
                            requirements.referenceBrand &&
                                requirements.referenceSize

                                ? `${requirements.referenceBrand} ${requirements.referenceSize}`

                                : 'Not specified'
                        }

                    </strong>

                </div>


                {/* SIZE PREFERENCE */}

                <div className="summary-item">

                    <span>
                        Size Preference
                    </span>

                    <strong>

                        {
                            requirements.sizeAdjusted

                                ? 'Custom adjusted'

                                : requirements.sizeSatisfied ===
                                    true

                                    ? 'Reference size'

                                    : requirements.sizeType ===
                                        'custom'

                                        ? 'Custom size'

                                        : 'Not specified'
                        }

                    </strong>

                </div>


                {/* SIZE ADJUSTMENTS */}

                {
                    requirements.sizeAdjusted && (

                        <div className="custom-measurements">


                            <div className="summary-subtitle">
                                Size Adjustments
                            </div>


                            <div className="summary-item">

                                <span>
                                    Chest
                                </span>

                                <strong>

                                    {
                                        requirements.adjustments.chest >
                                            0

                                            ? '+'

                                            : ''
                                    }

                                    {
                                        requirements.adjustments.chest
                                    }

                                </strong>

                            </div>


                            <div className="summary-item">

                                <span>
                                    Waist
                                </span>

                                <strong>

                                    {
                                        requirements.adjustments.waist >
                                            0

                                            ? '+'

                                            : ''
                                    }

                                    {
                                        requirements.adjustments.waist
                                    }

                                </strong>

                            </div>


                            <div className="summary-item">

                                <span>
                                    Shoulder
                                </span>

                                <strong>

                                    {
                                        requirements.adjustments.shoulder >
                                            0

                                            ? '+'

                                            : ''
                                    }

                                    {
                                        requirements.adjustments.shoulder
                                    }

                                </strong>

                            </div>


                            <div className="summary-item">

                                <span>
                                    Length
                                </span>

                                <strong>

                                    {
                                        requirements.adjustments.length >
                                            0

                                            ? '+'

                                            : ''
                                    }

                                    {
                                        requirements.adjustments.length
                                    }

                                </strong>

                            </div>


                            <div className="summary-item">

                                <span>
                                    Sleeve
                                </span>

                                <strong>

                                    {
                                        requirements.adjustments.sleeve >
                                            0

                                            ? '+'

                                            : ''
                                    }

                                    {
                                        requirements.adjustments.sleeve
                                    }

                                </strong>

                            </div>

                        </div>
                    )
                }


                {/* CUSTOM MEASUREMENTS */}

                {
                    requirements.sizeType ===
                    'custom' &&

                    !requirements.sizeAdjusted && (

                        <div className="custom-measurements">


                            <div className="summary-subtitle">
                                Custom Measurements
                            </div>


                            <div className="summary-item">

                                <span>
                                    Chest
                                </span>

                                <strong>
                                    {
                                        requirements.measurements.chest ||
                                        '-'
                                    } in
                                </strong>

                            </div>


                            <div className="summary-item">

                                <span>
                                    Waist
                                </span>

                                <strong>
                                    {
                                        requirements.measurements.waist ||
                                        '-'
                                    } in
                                </strong>

                            </div>


                            <div className="summary-item">

                                <span>
                                    Shoulder
                                </span>

                                <strong>
                                    {
                                        requirements.measurements.shoulder ||
                                        '-'
                                    } in
                                </strong>

                            </div>


                            <div className="summary-item">

                                <span>
                                    Length
                                </span>

                                <strong>
                                    {
                                        requirements.measurements.length ||
                                        '-'
                                    } in
                                </strong>

                            </div>

                        </div>
                    )
                }


                {/* ==================================
                    CONFIRMATION BUTTONS
                ================================== */}

                {
                    showConfirmation && (

                        <div className="summary-actions">


                            <button
                                className="summary-change-button"
                                onClick={
                                    handleMakeChanges
                                }
                            >
                                ✎ Make Changes
                            </button>


                            <button
                                className="summary-generate-button"
                                onClick={
                                    handleGenerateDesign
                                }
                            >
                                ✓ Looks Good — Generate Design
                            </button>

                        </div>
                    )
                }

            </div>
        );
    };


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="ai-design-page">


            {/* =====================================
                HEADER
            ====================================== */}

            <header className="ai-design-header">


                <div className="ai-brand">


                    <div className="ai-brand-icon">
                        ✨
                    </div>


                    <div>


                        <div className="ai-brand-name">
                            Cosplay Design Studio
                        </div>


                        <div className="ai-brand-status">
                            AI Design Agent
                        </div>


                    </div>

                </div>


                <button
                    className="new-chat-button"
                    onClick={
                        startNewChat
                    }
                >

                    <span>
                        ＋
                    </span>

                    New Chat

                </button>

            </header>


            {/* =====================================
                CHAT AREA
            ====================================== */}

            <main className="ai-chat-area">


                {/* ==================================
                    WELCOME
                ================================== */}

                {
                    messages.length === 0 && (

                        <div className="ai-welcome">


                            <div className="welcome-icon">
                                ✨
                            </div>


                            <h1>
                                Cosplay Design Studio
                            </h1>


                            <p className="welcome-main-text">
                                Bring your cosplay ideas to life.
                            </p>


                            <p className="welcome-secondary-text">

                                Describe what you want
                                to create and I'll help
                                you develop the design
                                through conversation.

                            </p>

                        </div>
                    )
                }


                {/* ==================================
                    MESSAGES
                ================================== */}

                {
                    messages.length > 0 && (

                        <div className="messages-container">


                            {
                                messages.map(
                                    (message) => (

                                        <div
                                            key={
                                                message.id
                                            }

                                            className={
                                                `message-row ${message.sender ===
                                                    'user'

                                                    ? 'user-row'

                                                    : 'ai-row'
                                                }`
                                            }
                                        >


                                            {/* AI AVATAR */}

                                            {
                                                message.sender ===
                                                'ai' && (

                                                    <div className="message-avatar ai-avatar">
                                                        ✨
                                                    </div>
                                                )
                                            }


                                            {/* SUMMARY */}

                                            {
                                                message.type ===
                                                    'summary'

                                                    ? (

                                                        <div className="message-content ai-message">

                                                            {
                                                                renderSummary(
                                                                    message.requirements
                                                                )
                                                            }

                                                        </div>

                                                    )

                                                    : message.type ===
                                                        'generated-design'

                                                        ? (

                                                            <div className="message-content ai-message generated-design-message">

                                                                {
                                                                    renderGeneratedDesign(
                                                                        message.requirements
                                                                    )
                                                                }

                                                            </div>

                                                        )

                                                        : (

                                                            <div
                                                                className={
                                                                    `message-content ${message.sender ===
                                                                        'user'

                                                                        ? 'user-message'

                                                                        : 'ai-message'
                                                                    }`
                                                                }
                                                            >

                                                                {
                                                                    message.text
                                                                }

                                                            </div>
                                                        )
                                            }

                                        </div>
                                    )
                                )
                            }


                            {/* =================================
                                SIZE ADJUSTER
                            ================================== */}

                            {
                                showSizeAdjuster && (

                                    <div className="message-row ai-row">


                                        <div className="message-avatar ai-avatar">
                                            ✨
                                        </div>


                                        <div className="message-content ai-message size-adjuster-message">


                                            <SizeAdjuster
                                                initialAdjustments={
                                                    designRequirements.adjustments
                                                }
                                                onSave={
                                                    handleSizeAdjustmentSave
                                                }
                                            />


                                        </div>

                                    </div>
                                )
                            }


                            {/* =================================
                                DESIGN GENERATION
                            ================================== */}

                            {
                                isGenerating && (

                                    <div className="generation-message-row">


                                        <div className="message-avatar ai-avatar">
                                            ✨
                                        </div>


                                        <div className="generation-card">


                                            <div className="generation-card-title">
                                                Creating your design
                                            </div>


                                            <div className="generation-card-subtitle">

                                                {
                                                    [
                                                        'Analyzing your concept...',
                                                        'Applying garment...',
                                                        'Applying color and design...',
                                                        'Applying your selected style...',
                                                        'Applying size adjustments...',
                                                        'Generating your design...',
                                                    ][
                                                    generationStep
                                                    ]
                                                }

                                            </div>


                                            <div className="generation-progress">


                                                <div
                                                    className="generation-progress-bar"

                                                    style={{
                                                        width:
                                                            `${Math.min(
                                                                (
                                                                    (
                                                                        generationStep +
                                                                        1
                                                                    ) /
                                                                    6
                                                                ) *
                                                                100,

                                                                100
                                                            )}%`,
                                                    }}
                                                />

                                            </div>


                                            <div className="generation-steps">


                                                {
                                                    [
                                                        'Concept',
                                                        'Garment',
                                                        'Style',
                                                        'Color',
                                                        'Size',
                                                        'Final Design',
                                                    ].map(
                                                        (
                                                            step,
                                                            index
                                                        ) => (

                                                            <div
                                                                key={
                                                                    step
                                                                }

                                                                className={
                                                                    index <=
                                                                        generationStep

                                                                        ? 'generation-step active'

                                                                        : 'generation-step'
                                                                }
                                                            >


                                                                <span>

                                                                    {
                                                                        index <=
                                                                            generationStep

                                                                            ? '✓'

                                                                            : index +
                                                                            1
                                                                    }

                                                                </span>


                                                                <small>
                                                                    {
                                                                        step
                                                                    }
                                                                </small>


                                                            </div>
                                                        )
                                                    )
                                                }

                                            </div>

                                        </div>

                                    </div>
                                )
                            }


                            {/* =================================
                                TYPING INDICATOR
                            ================================== */}

                            {
                                isTyping && (

                                    <div className="message-row ai-row">


                                        <div className="message-avatar ai-avatar">
                                            ✨
                                        </div>


                                        <div className="typing-indicator">


                                            <span></span>

                                            <span></span>

                                            <span></span>


                                        </div>

                                    </div>
                                )
                            }


                            <div
                                ref={
                                    messagesEndRef
                                }
                            />

                        </div>
                    )
                }

            </main>


            {/* =====================================
                INPUT
            ====================================== */}

            <footer className="ai-input-section">


                <div className="ai-input-wrapper">


                    <div className="ai-input-box">


                        <textarea
                            value={input}

                            onChange={(event) =>
                                setInput(
                                    event.target.value
                                )
                            }

                            onKeyDown={
                                handleKeyDown
                            }

                            placeholder={
                                changeMode
                                    ? 'Tell me what you would like to change...'
                                    : 'Describe the clothing or cosplay you want to create...'
                            }

                            rows="1"

                            disabled={
                                isTyping ||
                                isGenerating
                            }
                        />


                        <button
                            className="send-button"

                            onClick={
                                sendMessage
                            }

                            disabled={
                                !input.trim() ||
                                isTyping ||
                                isGenerating
                            }

                            aria-label="Send message"
                        >
                            ↑
                        </button>


                    </div>


                    <p className="input-disclaimer">

                        Cosplay Design Studio can help
                        develop clothing concepts,
                        styles, colors, fits, and designs.

                    </p>

                </div>

            </footer>

        </div>
    );
}

export default AIDesignPage;