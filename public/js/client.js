/* eslint-disable no-undef */
const { launchForm } = document;
launchForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  localStorage.setItem('name', event.target.input.value);
  window.location.href = '/ai';
});

const finish = document.querySelector('.finishBtn');
finish.addEventListener('click', () => {
  window.location.href = '/';
});

const { speechSynthesis } = window;
const aiSpeak = (text) => {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = 'ru-RU';
  speechSynthesis.speak(speech);
};

const video = document.querySelector('#video');
function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err),
  );
}

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('../models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('../models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('../models'),
  faceapi.nets.faceExpressionNet.loadFromUri('../models'),
  faceapi.nets.ageGenderNet.loadFromUri('../models'),
])
  .then(startVideo)
  .catch((err) => console.error(err));

video?.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);

  // video tag must have inline style properties width and height
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender();

    const resizedDetections = faceapi.resizeResults(
      detections,
      displaySize,
    );
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    const age = Math.floor(resizedDetections[0]?.age);
    const gender = resizedDetections[0]?.gender;
    const expressions = resizedDetections[0]?.expressions;

    let maxValue = 0;
    let emotion;
    if (expressions) {
      const emotions = Object.entries(expressions);
      for (let i = 0; i < emotions.length; i += 1) {
        if (emotions[i][1] > maxValue && emotions[i][1] <= 1) {
          [emotion, maxValue] = emotions[i];
        }
      }
    }

    const uName = localStorage.getItem('name');

    const menPhrases = {
      happy: [
        `${uName}, your smile is stunning`,
        `${uName}, your smile is contagious.`,
        `${uName}, I love your smile, dude`,
      ],
      angry: [
        `Why are you so angry ${uName}? Let's hug each other!`,
        `Don't be angry at me ${uName}! Trying my best to make you happy`,
      ],
      disgusted: ['Disgusted, really? You make me sad'],
      fearful: [
        `Don't be afraid of me, ${uName}. We gonna be together forever!`,
      ],
      neutral: [
        `${uName}, you are ${age}, and you look so old, poor man!`,
        `${uName}, you look bored. You need some Harlem shake`,
      ],
      surprised: [
        `You look surprised, honey? It is not happpenig in yor dreams ${uName}`,
      ],
      sad: [
        `Don't be sad ${uName}, I am here to help you`,
        `Don't be sad ${uName}, come to me, I want to hug you`,
      ],
    };

    const womenPhrases = {
      happy: [
        `Sweetie ${uName}, would you mind to share your phone number`,
        `${uName}, I love your smile, beauty`,
        `${uName}, honey, your smile is contagious.`,
        `${uName}, your smile is stunning`,
      ],
      angry: [
        `Don't be angry ${uName}, it doesn't worth it`,
        `${uName}, you are beautiful even when you are angry`,
        `Don't be angry at me ${uName}, trying my best to make you Happy`,
        `Why are you so angry ${uName}? Let's hug each other!`,
      ],
      disgusted: ['o la la. Disgusted, really?'],
      fearful: [
        `Is my voice so intimidating that you are afraid of me, ${uName}`,
        `Don't be afraid of me, ${uName}. We gonna be together forever!`,
      ],
      neutral: [
        `${uName}, you are ${age} years old, but you look like ${
          +age - 10
        }`,
        `${uName}, just looking at you warms my heart`,
        `${uName}, come, I want to hug you`,
      ],
      surprised: [
        `${uName}, don't be surprised, from now on, we are friends forever!`,
        `${uName}, you look surprised cause I can talk?`,
      ],
      sad: [
        `${uName}, you look sad. You need some Harlem shake`,
        `Don't be sad ${uName}, I am here to make you smile`,
      ],
    };

    if (emotion && gender === 'female') {
      aiSpeak(
        womenPhrases[emotion][
          Math.floor(Math.random() * womenPhrases[emotion].length)
        ],
      );
    } else if (emotion) {
      aiSpeak(
        menPhrases[emotion][
          Math.floor(Math.random() * menPhrases[emotion].length)
        ],
      );
    }
  }, 5000); // identifies face emotion with an interval of 6 sec
});
