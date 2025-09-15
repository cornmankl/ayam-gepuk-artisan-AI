/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {GoogleGenAI, GeneratedImage, PersonGeneration, Chat} from '@google/genai';

// Corrected API key environment variable name as per guidelines
const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

// UI Elements
const promptInput = document.getElementById('prompt-input') as HTMLTextAreaElement;
const aspectRatioSelect = document.getElementById('aspect-ratio-select') as HTMLSelectElement;
const generateBtn = document.getElementById('generate-btn') as HTMLButtonElement;
const imageGallery = document.getElementById('image-gallery');
const promptTemplateSelect = document.getElementById('prompt-template-select') as HTMLSelectElement;
const brandedPaperCheckbox = document.getElementById('branded-paper-checkbox') as HTMLInputElement;
const tehOAisCheckbox = document.getElementById('teh-o-ais-checkbox') as HTMLInputElement;
const kicapCheckbox = document.getElementById('kicap-checkbox') as HTMLInputElement;
const kubisGorengCheckbox = document.getElementById('kubis-goreng-checkbox') as HTMLInputElement;
const tahuCheckbox = document.getElementById('tahu-checkbox') as HTMLInputElement;
const tempeCheckbox = document.getElementById('tempe-checkbox') as HTMLInputElement;
const extraSambalCheckbox = document.getElementById('extra-sambal-checkbox') as HTMLInputElement;
const promptSparkersContainer = document.getElementById('prompt-sparkers-container');

// AI Assistant UI Elements
const assistantBtn = document.getElementById('ai-assistant-btn');
const assistantModal = document.getElementById('ai-assistant-modal');
const assistantOverlay = document.getElementById('ai-assistant-overlay');
const assistantCloseBtn = document.getElementById('ai-assistant-close-btn');
const chatMessagesContainer = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input') as HTMLInputElement;
const typingIndicator = document.getElementById('typing-indicator');

// -------------------- CHOOSE AN IMAGEN MODEL -------------------------------------------------
const selectedModel = 'imagen-4.0-generate-001';

// Cooldown configuration
const COOLDOWN_SECONDS = 10;
let cooldownInterval: number | undefined;

// Prompt Templates for Ayam Gepuk Artisan
const promptTemplates: { title: string; prompt: string; description: string; }[] = [
    { title: 'Classic Product Shot', prompt: 'Commercial product photography of Ayam Gepuk Artisan. A perfectly fried, crispy golden-brown chicken leg on a bed of fluffy white rice. Accompanied by a vibrant red dollop of spicy sambal, fresh cucumber slices, and fried tofu. Shot on a clean, minimalist white background with soft studio lighting, sharp focus, ultra-realistic texture. 8k.', description: 'Perfect for menus, websites, and high-quality ads. Clean and professional.' },
    { title: 'Spicy Action Shot', prompt: 'Dynamic action shot of sambal being drizzled over a crispy Ayam Gepuk Artisan. The chicken is dramatically lit from the side, highlighting the crunchy texture. Red chili flakes are captured mid-air. Dark, moody background. Macro photography, high shutter speed.', description: 'Dynamic and exciting. Great for social media posts that grab attention.' },
    { title: 'Flat Lay Menu Style', prompt: 'Top-down flat lay of a complete Ayam Gepuk Artisan meal set. Includes the chicken, rice, sambal, fresh lalapan (vegetables), and a glass of iced tea. Arranged neatly on a rustic wooden table. Bright, even lighting. Perfect for a menu cover. Food photography.', description: 'Ideal for menu covers, posters, or website banners. Shows the full meal.' },
    { title: 'Poster with Text Space', prompt: 'Eye-catching advertising poster for Ayam Gepuk Artisan. A large, heroic shot of the crispy chicken dish is placed on the left, with a clean, dark slate background on the right providing ample copy space for promotional text. Dramatic lighting, vibrant colors.', description: 'Designed for ads. Leaves room on the right for your promotional text.' },
    { title: 'Lifestyle - Enjoyment', prompt: 'A candid shot of a person\'s hands using a fork and spoon to break into the crispy chicken of an Ayam Gepuk Artisan meal. The background is a bustling, warmly lit restaurant, slightly out of focus. Conveys a sense of deliciousness and satisfaction. Lifestyle food photography.', description: 'Relatable and engaging. Shows customers enjoying the food. Good for social content.' },
    { title: 'Extreme Close-Up', prompt: 'Macro photograph focusing on the texture of the Ayam Gepuk Artisan\'s crispy skin and the glistening, chunky sambal. Every detail is sharp and clear. Shallow depth of field, making the background a soft blur. Food art.', description: 'Highlights texture and detail. Perfect for food blogs or artistic shots.' },
    { title: 'Takeaway Packaging Shot', prompt: 'Commercial photography of the Ayam Gepuk Artisan packed neatly in a branded takeaway box. The box is open, revealing the delicious meal inside. Shot against a bright, solid yellow background to match branding. Clean and modern.', description: 'Promotes your delivery/takeaway service. Clean and modern look.' },
    { title: '"Krispy" vs "Klasik" Comparison', prompt: 'A split-screen style commercial shot. On the left, \'Ayam Krispy\' with its unique crunchy coating. On the right, \'Ayam Klasik\' with its traditional look. Both are presented identically. Minimalist background. Highlights the choice for customers.', description: 'Visually explains the choice between two chicken styles. Great for menus.' },
    { title: 'Steam and Freshness', prompt: 'Aromatic shot of a freshly served Ayam Gepuk Artisan. Visible steam is rising from the hot rice and chicken. The vegetables look crisp and dewy. Soft, natural morning light coming from a window. Evokes a feeling of warmth and freshness.', description: 'Evokes a sense of warmth and freshness. Makes the food look irresistible.' },
    { title: 'Family Meal Deal', prompt: 'A large platter featuring multiple pieces of Ayam Gepuk Artisan, a large bowl of rice, various side dishes like tempeh and tofu, and multiple drinks. Presented as a family sharing meal. Warm, inviting atmosphere. Shot from a 45-degree angle.', description: 'Showcases value and sharing. Ideal for promoting family-sized combos.' },
    { title: 'Minimalist Dark Mode', prompt: 'A single plate of Ayam Gepuk Artisan shot against a dark, textured slate background. A single, dramatic spotlight illuminates the dish from above. High contrast, moody, and sophisticated. Fine-dining presentation.', description: 'Sophisticated and premium. Suitable for a fine-dining or high-end look.' },
    { title: 'Ingredients Spotlight', prompt: 'Deconstructed flat lay showcasing the fresh ingredients used in Ayam Gepuk Artisan\'s sambal: red chilies, shallots, garlic, tomatoes. The finished chicken dish is in the center. Bright, clean lighting on a white background.', description: 'Emphasizes freshness and quality of ingredients. Builds trust with customers.' },
    { title: 'Lunch Rush Scene', prompt: 'Advertising photograph capturing the energy of a lunch rush. A plate of Ayam Gepuk Artisan is in the foreground in sharp focus, while the background shows a blurred motion of customers in a modern eatery. Dynamic and energetic.', description: 'Creates a sense of popularity and high demand. Good for social proof.' },
    { title: 'Artisan Craftsmanship', prompt: 'A photo emphasizing the \'Artisan\' aspect. A chef\'s hands are shown carefully arranging the crushed chicken and sambal on the plate. Close-up on the hands and food. Warm, workshop-like lighting.', description: 'Focuses on the \'hand-made\' quality. Reinforces the \'Artisan\' brand name.' },
    { title: 'The Perfect Bite', prompt: 'A close-up shot of a fork holding the \'perfect bite\' - a piece of crispy chicken, rice, and a bit of sambal. The rest of the plate is softly blurred in the background. Highly appetizing and relatable.', description: 'Highly appetizing and relatable. Makes viewers crave a bite.' },
    { title: 'Side Dish Showcase', prompt: 'A product shot focusing on the side dishes. Crispy fried tempeh, tofu, and fresh kubis goreng (fried cabbage) arranged beautifully around the main chicken dish. Well-lit on a neutral background.', description: 'Upsell your side dishes. Shows the variety you offer.' },
    { title: 'Iced Tea Pairing', prompt: 'A refreshing shot of Ayam Gepuk Artisan paired with a tall, glistening glass of iced lemon tea. Condensation is visible on the glass. The background is bright and suggests a hot day. Perfect for a combo meal promotion.', description: 'Promotes combo deals. Makes the meal look refreshing.' },
    { title: 'Delivery Promotion', prompt: 'A photo of a food delivery rider\'s thermal bag with an Ayam Gepuk Artisan takeaway box peeking out. The background is a clean, modern home entrance. Promotes delivery service and convenience.', description: 'Clearly communicates your delivery service. Focuses on convenience.' },
    { title: 'Outdoor Picnic Setting', prompt: 'Lifestyle image of an Ayam Gepuk Artisan takeaway box being enjoyed in a park/picnic setting. Green grass and soft sunlight in the background. Conveys versatility and on-the-go enjoyment.', description: 'Shows versatility. Your food can be enjoyed anywhere.' },
    { title: 'Vibrant Color Pop', prompt: 'Ayam Gepuk Artisan presented on a brightly colored turquoise plate against a contrasting plain background. The colors are highly saturated and vibrant. Modern, pop-art feel.', description: 'Modern and eye-catching. Perfect for platforms like Instagram.' },
    { title: 'Focus on the Sambal', prompt: 'A macro shot of a stone mortar and pestle (ulekan) filled with freshly ground, chunky red sambal. A piece of the crispy chicken is placed next to it. Emphasizes the authentic, freshly made chili paste.', description: 'Highlights your signature sambal. Appeals to spicy food lovers.' },
    { title: 'Banner for Social Media', prompt: 'A wide banner-style image, perfect for a social media header. The Ayam Gepuk Artisan meal is placed to one side, with artistic food styling, leaving negative space for logos and text. 16:9 aspect ratio in mind.', description: 'Pre-formatted for wide spaces like Facebook or Twitter headers.' },
    { title: 'Limited Time Offer Theme', prompt: 'A promotional poster design. Ayam Gepuk Artisan is in the center, with a bold, graphic overlay that says \'SPECIAL OFFER\'. Use of urgent colors like red and yellow. High energy, commercial feel.', description: 'Urgent and commercial. Designed for special promotion announcements.' },
    { title: 'The "Classic" Appeal', prompt: 'A nostalgic, warm-toned photograph of the \'Ayam Klasik\' version. Served on a vintage-style plate with a slightly rustic, home-style background. Evokes comfort food and tradition.', description: 'Nostalgic and comforting. Appeals to lovers of traditional flavors.' },
    { title: 'Behind the Scenes - Kitchen', prompt: 'An editorial shot from a clean, professional kitchen. A chef in uniform is plating an Ayam Gepuk Artisan dish with precision. Stainless steel surfaces reflect the light. Shows professionalism and quality.', description: 'Shows professionalism and cleanliness. Builds brand trust.' },
    { title: 'Combo Meal with Soup', prompt: 'Product photography of the Ayam Gepuk meal served alongside a small, steaming bowl of clear soup. This pairing suggests a more complete and comforting meal. Soft, warm lighting.', description: 'Presents a complete, comforting meal. Good for upselling.' },
    { title: 'Student\'s Favorite Lunch', prompt: 'A relatable lifestyle shot of a student\'s desk with books, a laptop, and a plate of Ayam Gepuk Artisan. Suggests it\'s an affordable and popular meal for young people. Natural light from a window.', description: 'Targets a younger demographic. Relatable and affordable feel.' },
    { title: 'Spicy Challenge Theme', prompt: 'A dramatic photo with stylized flames visually integrated behind the Ayam Gepuk Artisan plate. The sambal looks extra red and fiery. Geared towards customers who love extremely spicy food. Dark background, high contrast.', description: 'Exciting and bold. Great for marketing campaigns and engaging followers.' },
    { title: 'Clean and Healthy Perception', prompt: 'A carefully styled shot of Ayam Gepuk Artisan where the fresh, green vegetables (cucumber, lettuce) are prominently featured. The lighting is bright and airy. The chicken is presented to look less greasy. Appeals to a health-conscious audience.', description: 'Appeals to health-conscious customers by highlighting fresh ingredients.' },
    { title: 'Generous Portion Shot', prompt: 'A close-up photograph from a low angle, making the Ayam Gepuk Artisan portion look heroic and generous. The crispy chicken towers over the rice and sambal. Shallow depth of field, focusing on the main dish.', description: 'Makes the meal look substantial and great value for money.' }
];

// Data for Prompt Idea Sparkers
const promptSparkers = {
  'Style': [
    { label: 'Minimalist', phrase: ', minimalist, clean background' },
    { label: 'Action Shot', phrase: ', dynamic action shot, high shutter speed' },
    { label: 'Macro', phrase: ', macro photography, extreme close-up on texture' },
    { label: 'Lifestyle', phrase: ', lifestyle food photography, candid' },
    { label: 'Poster', phrase: ', advertising poster style, copy space' },
    { label: 'Flat Lay', phrase: ', top-down flat lay' },
  ],
  'Lighting': [
    { label: 'Studio', phrase: ', soft studio lighting' },
    { label: 'Dramatic', phrase: ', dramatic side lighting, moody' },
    { label: 'Natural', phrase: ', soft natural light from a window' },
    { label: 'Bright & Airy', phrase: ', bright and airy lighting' },
  ],
  'Background': [
    { label: 'Dark Slate', phrase: ', on a dark, textured slate background' },
    { label: 'Rustic Wood', phrase: ', on a rustic wooden table' },
    { label: 'Vibrant Color', phrase: ', against a solid, vibrant color background' },
    { label: 'Restaurant', phrase: ', with a bustling restaurant in a soft blur background' },
  ],
  'Vibe': [
    { label: 'Fresh', phrase: ', steam rising, evoking freshness' },
    { label: 'Sophisticated', phrase: ', sophisticated, fine-dining presentation' },
    { label: 'Nostalgic', phrase: ', nostalgic, warm-toned, comforting' },
    { label: 'Generous', phrase: ', heroic low-angle shot, looks like a generous portion' },
  ]
};


// Populate prompt templates
if (promptTemplateSelect) {
    promptTemplates.forEach(template => {
        const option = document.createElement('option');
        option.value = template.prompt;
        option.textContent = template.title;
        option.title = template.description; // Add tooltip here
        promptTemplateSelect.appendChild(option);
    });

    promptTemplateSelect.addEventListener('change', () => {
        if (promptInput && promptTemplateSelect.value) {
            promptInput.value = promptTemplateSelect.value;
        }
    });
}

// Set default prompt from the first template
if (promptInput && promptTemplates.length > 0) {
    promptInput.value = promptTemplates[0].prompt;
}

// Function to populate Prompt Idea Sparkers
function populateSparkers() {
    if (!promptSparkersContainer) return;
    
    Object.entries(promptSparkers).forEach(([category, sparkers]) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'sparker-category';
        
        const categoryLabel = document.createElement('span');
        categoryLabel.className = 'sparker-category-label';
        categoryLabel.textContent = category;
        categoryDiv.appendChild(categoryLabel);

        sparkers.forEach(sparker => {
            const button = document.createElement('button');
            button.className = 'sparker-btn';
            button.textContent = sparker.label;
            button.dataset.phrase = sparker.phrase;
            button.type = 'button'; // Prevent form submission
            categoryDiv.appendChild(button);
        });
        promptSparkersContainer.appendChild(categoryDiv);
    });

    // Add event listener using event delegation
    promptSparkersContainer.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        if (target.classList.contains('sparker-btn') && !target.disabled) {
            const phrase = target.dataset.phrase;
            if (promptInput && phrase) {
                if (promptInput.value.trim() === '') {
                    // If empty, remove leading comma and space
                    promptInput.value += phrase.substring(2);
                } else {
                    promptInput.value += phrase;
                }
                promptInput.focus();
            }
        }
    });
}

// Function to handle the generation button cooldown
function startCooldown() {
    if (!generateBtn) return;
    
    let secondsRemaining = COOLDOWN_SECONDS;
    generateBtn.disabled = true;

    // Clear any existing interval to prevent overlaps
    if (cooldownInterval) {
        clearInterval(cooldownInterval);
    }
    
    generateBtn.textContent = `Please wait (${secondsRemaining}s)`;

    cooldownInterval = window.setInterval(() => {
        secondsRemaining--;
        if (secondsRemaining > 0) {
            generateBtn.textContent = `Please wait (${secondsRemaining}s)`;
        } else {
            clearInterval(cooldownInterval);
            cooldownInterval = undefined;
            generateBtn.textContent = 'Generate Images';
            generateBtn.disabled = false;
        }
    }, 1000);
}


// Function to handle UI state (loading, error, success, idle)
function setUIState(state: 'loading' | 'error' | 'success' | 'idle', message?: string) {
    if (!imageGallery) return;

    const isLoading = state === 'loading';

    // Control form elements
    const controls = [
        promptInput, 
        aspectRatioSelect, 
        promptTemplateSelect, 
        brandedPaperCheckbox, 
        tehOAisCheckbox,
        kicapCheckbox,
        kubisGorengCheckbox,
        tahuCheckbox,
        tempeCheckbox,
        extraSambalCheckbox
    ];
    controls.forEach(el => {
        if (el) (el as HTMLInputElement).disabled = isLoading;
    });

    // The generate button is handled separately by the cooldown logic
    if (generateBtn) {
        generateBtn.disabled = isLoading;
    }

    // Disable sparker buttons
    document.querySelectorAll('.sparker-btn').forEach(btn => {
        (btn as HTMLButtonElement).disabled = isLoading;
    });


    // Update gallery content
    if (state !== 'success') {
       imageGallery.innerHTML = ''; 
    }
    
    if (state === 'loading') {
        const loadingEl = document.createElement('div');
        loadingEl.className = 'loading';
        
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        loadingEl.appendChild(spinner);

        const loadingText = document.createElement('p');
        loadingText.textContent = 'Generating images... This may take a moment.';
        loadingEl.appendChild(loadingText);

        imageGallery.appendChild(loadingEl);
    } else if (state === 'error') {
        const errorEl = document.createElement('div');
        errorEl.className = 'error';
        errorEl.textContent = `Error: ${message || 'Could not load images. Check the console for details.'}`;
        imageGallery.appendChild(errorEl);
    } else if (state === 'idle') {
        const idleEl = document.createElement('div');
        idleEl.className = 'idle-message';
        idleEl.textContent = 'Select a template and click "Generate Images" to begin.';
        imageGallery.appendChild(idleEl);
    }
}

async function generateImages() {
  if (!promptInput || !aspectRatioSelect || !imageGallery) {
      console.error("Required UI elements are missing.");
      return;
  }

  let prompt = promptInput.value;
  const aspectRatio = aspectRatioSelect.value;

  if (!prompt) {
      alert("Please enter a prompt.");
      return;
  }
  
  if (brandedPaperCheckbox?.checked) {
    prompt += ". The entire meal must be presented directly on a sheet of 'AyamGepuk Artisan' branded food paper. This paper is white and features a repeating diagonal pattern of the text 'AyamGepuk Artisan' in a bold, vibrant orange-red, modern sans-serif font.";
  }

  if (tehOAisCheckbox?.checked) {
    prompt += ", paired with a tall, refreshing glass of iced tea with a slice of lemon (Air Teh O Ais)";
  }

  if (kicapCheckbox?.checked) {
    prompt += ", with a side of sweet soy sauce (kicap manis)";
  }
  
  if (kubisGorengCheckbox?.checked) {
    prompt += ", with a side of crispy fried cabbage (kubis goreng)";
  }

  if (tahuCheckbox?.checked) {
    prompt += ", with a side of golden-brown fried tofu (tahu goreng)";
  }

  if (tempeCheckbox?.checked) {
    prompt += ", with a side of crispy fried tempeh (tempe goreng)";
  }
  
  if (extraSambalCheckbox?.checked) {
    prompt += ", with a generous extra portion of spicy sambal on the side";
  }

  setUIState('loading');
  imageGallery.innerHTML = ''; // Clear previous images before loading new ones

  try {
      const response = await ai.models.generateImages({
        model: selectedModel,
        prompt: prompt,
        config: {
            numberOfImages: 3,
            aspectRatio: aspectRatio, // Use selected aspect ratio
            personGeneration: PersonGeneration.ALLOW_ADULT,
            outputMimeType: 'image/jpeg',
            includeRaiReason: true,
        },
      });

      
      // PREVIEW THE GENERATED IMAGES
      if (response?.generatedImages && response.generatedImages.length > 0) {
          setUIState('success');
          response.generatedImages.forEach((generatedImage: GeneratedImage, index: number) => {
              if (generatedImage.image?.imageBytes) {
                  const src = `data:image/jpeg;base64,${generatedImage.image.imageBytes}`;
                  
                  // Create container for image and download button
                  const imageContainer = document.createElement('div');
                  imageContainer.className = 'image-container';

                  // Create image element
                  const img = new Image();
                  img.src = src;
                  img.alt = `${prompt} - Image ${Number(index) + 1}`;
                  
                  // Create download button
                  const downloadLink = document.createElement('a');
                  downloadLink.href = src;
                  downloadLink.download = `generated-image-${Date.now()}-${index + 1}.jpeg`;
                  downloadLink.className = 'download-btn';
                  downloadLink.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg><span>Download</span>`;
                  downloadLink.setAttribute('aria-label', `Download image ${index + 1}`);

                  // Append image and button to container
                  imageContainer.appendChild(img);
                  imageContainer.appendChild(downloadLink);

                  // Append container to gallery
                  imageGallery.appendChild(imageContainer);
              }
          });
      } else {
          setUIState('error', 'No images were generated. The response may have been filtered.');
      }

      // EXAMINE THE METADATA IN THE RESPONSE LOGS
      console.log('Full response:', response);
      if (response?.generatedImages) {
        console.log(`Number of generated images: ${response.generatedImages.length}`);
        response.generatedImages.forEach((generatedImage: GeneratedImage, index: number) => {
            console.log(`--- Image ${Number(index) + 1} ---`);
            if (generatedImage.image?.mimeType) {
              console.log(`MIME Type: ${generatedImage.image.mimeType}`);
            }
            if (generatedImage.raiFilteredReason) {
              console.log(`RAI Filtered Reason: ${generatedImage.raiFilteredReason}`);
            }
            if (generatedImage.safetyAttributes) {
              console.log('Safety Attributes:', generatedImage.safetyAttributes);
            }
        });
      }

  } catch (error) {
      console.error("Error generating images or processing response:", error);
      const errorMessage = (error as Error).message;
      let friendlyMessage = errorMessage;

      if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
        friendlyMessage = 'Rate limit exceeded. Please wait for the cooldown before trying again.';
      }

      setUIState('error', friendlyMessage);
  } finally {
      // Start the cooldown after every attempt (success or fail)
      startCooldown();
  }
}

// --- AI Assistant Logic ---

let chat: Chat | null = null;

function initializeChat() {
    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are a friendly and creative marketing assistant for a Malaysian brand called "Ayam Gepuk Artisan". Your expertise is in food marketing, social media, and advertising. Your goal is to help the user generate amazing marketing materials.
            - Answer questions about the brand.
            - Brainstorm marketing ideas, slogans, and campaign concepts.
            - Help write captions for social media (Instagram, Facebook, TikTok).
            - Assist in refining prompts for the image generator to get better results.
            - Keep your tone encouraging and helpful.
            - Communicate in either English or Malay, depending on the user's language.
            - Start the conversation with a friendly welcome message.`,
        },
    });
}

function openChat() {
    if (!assistantModal) return;
    if (!chat) {
      initializeChat();
      // Add the initial AI welcome message
      addChatMessage("Hello! I'm your AI Marketing Assistant. How can I help you promote Ayam Gepuk Artisan today? Need a catchy slogan or a social media caption?", 'ai');
    }
    assistantModal.classList.remove('hidden');
    chatInput.focus();
}

function closeChat() {
    assistantModal?.classList.add('hidden');
}

function addChatMessage(message: string, sender: 'user' | 'ai' | 'error') {
    if (!chatMessagesContainer) return;
    const messageEl = document.createElement('div');
    messageEl.className = `chat-message ${sender}`;
    messageEl.textContent = message;
    chatMessagesContainer.appendChild(messageEl);
    scrollToBottom();
}

function scrollToBottom() {
    chatMessagesContainer?.scrollTo({
        top: chatMessagesContainer.scrollHeight,
        behavior: 'smooth'
    });
}

async function handleSendMessage(e: Event) {
    e.preventDefault();
    if (!chat || !chatInput || !typingIndicator) return;
    
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    addChatMessage(userMessage, 'user');
    chatInput.value = '';
    
    typingIndicator.classList.remove('hidden');
    scrollToBottom();

    try {
        const response = await chat.sendMessage({ message: userMessage });
        const aiMessage = response.text;
        addChatMessage(aiMessage, 'ai');
    } catch(error) {
        console.error("AI Assistant Error:", error);
        addChatMessage("Sorry, I encountered an error. Please try again.", 'error');
    } finally {
        typingIndicator.classList.add('hidden');
        scrollToBottom();
    }
}

// Event Listeners
generateBtn?.addEventListener('click', generateImages);
assistantBtn?.addEventListener('click', openChat);
assistantCloseBtn?.addEventListener('click', closeChat);
assistantOverlay?.addEventListener('click', closeChat);
chatForm?.addEventListener('submit', handleSendMessage);

// Set the initial state and populate sparkers
document.addEventListener('DOMContentLoaded', () => {
    setUIState('idle');
    populateSparkers();
});