This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
## Gita Learn
## Getting Started


# Gita Learn

"Gita Learn" is a transformative gamified learning platform that merges ancient wisdom from the Bhagavad Gita with modern technology. It offers an interactive experience through Next.js frontend, Express.js backend, and search capabilities powered by Flask, utilizing TF-IDF and Cosine similarity. Deployed on Vercel and Onrender, it facilitates accessible and engaging exploration of spiritual teachings for contemporary audiences.



## Installation

Install Gita-Learn with npm

```bash
  npm install 
  cd Gita-Learn
  npm run dev
```

## Community Learning

We have created an Community Learning feature in which a user can create his/her own Community Id and using that Community id other user can join the Community and play the quiz together

We have used Firebase for Authentication Part and also storing the data
The files are present in the Profile Section and the commponets that are imported are

- CreateCommunityId

- Join Community

- Dashboard




## Features

- The home page contains all the chapters of Gita
- ChapterInfo Page contains all the verses of specific chapter of Gita
- VerseDetails Page contains the shloaks, synonyms, translation, purport and audio 
- Below the Purport we have Quiz Dropdown for users to attempt quiz under the community
- There are also audio and video lectures in accordion along with mind maps

## Reading Streak

Reading Streak is a feature to check how dedicated you are and how much effort you take to improve your reading.

- Enter Read Mode
- Exit Read Mode
- Check duration of your's into the read mode


Along with Reading streaks there is scroll features that tell you how portion of the reading content you have covered.

### VerseDetail.js Features

#### Change Theme

The `VerseDetail` component allows users to dynamically change the theme settings, such as font size, through a settings menu. By clicking on the settings icon, users can open a modal where they can increase or decrease the font size using buttons. This feature is especially useful for improving readability according to the user's preference.

**Usage:**
1. Click on the cogwheel icon at the bottom right of the screen.
2. Use the plus and minus buttons to adjust the font size.

**Implementation:**
- The `toggleSettings` function toggles the visibility of the settings modal.
- Font size adjustments are handled by `increaseFontSize` and `decreaseFontSize` functions, updating the `fontSizeClass` context.

---

#### Change Font Size

This feature provides a user-friendly interface to adjust the text size across the `VerseDetail` component. The font size adjustment is managed through a context that maintains the `fontSizeClass`, which is then applied to various text elements within the component.

**Usage:**
1. Access the font size settings through the settings modal.
2. Select the desired font size to enhance the viewing experience.

**Implementation:**
- A context (`FontSizeContext`) is used to store and update the `fontSizeClass`.
- The component re-renders with the selected font size when the user modifies the font size through the settings modal.

---

#### Search Engine Optimization (SEO)

The `VerseDetail` component is designed with SEO-friendly practices, including dynamic meta tags for the description and keywords based on the verse details. This enhances the visibility of the page on search engines, tailored to the specific content being displayed.

**Usage:**
- SEO features are automatic and do not require user interaction.

**Implementation:**
- Each verse page dynamically sets the `<title>`, `<meta name="description">`, and `<meta name="keywords">` tags based on the verse data fetched from the backend (Gita-Learn-Api).
- These tags help improve the page's SEO by providing relevant metadata for search engines.

**Example:**
```jsx
<head>
  <title>{`Chapter ${verseDetails.chapter_number} Verse ${verseDetails.verse_number}`}</title>
  <meta name="description" content={verseDetails.seo?.description} />
  <meta name="keywords" content={verseDetails.seo?.keywords?.join(', ')} />
</head>
```

These features enhance user experience and accessibility while ensuring that the content is optimized for search engines, broadening the reach and accessibility of the website.


# Scroll Depth Tracker

The Scroll Depth Tracker is a React component designed to track and display user scroll behavior within specific verses of a text. It consists of two main components: ScrollDepth and ScrollDataTable. The ScrollDepth component monitors user scrolling activities and logs relevant data to Firebase Firestore. The ScrollDataTable component retrieves and displays the logged scroll data in a paginated table format.

# Working:
The scrollDepth component keeps the track of two things
1.	The maximum scrolling of the verse page(in percentage).
2.	The total amount of time spend on a particular verse page (in minutes).
 The ‘verseEstimatedTime’ stores the estimated time of each verse based on the total number of words on that particular verse page in Keys and Values format where Key is the Verse ID and Value is the estimated time.
Now, the ScrollDataTable component takes this two parameters and performs the below Logic:-

## {data.scrollDepth > 80 && data.timeSpent >= verseEstimatedTimes[data.verse] ? 
 
If the ScrollDepth is more than or equal to 80% and time spent on particular verse is more than or equal to the Estimated time of that particular verse
Then, it will show a Green dot indicating that the user has completed the particular verse or else it will show a Yellow dot indicating that the particular verse is Incomplete.
Lets take an Example,
Suppose the Estimated time for Verse 1.6 is 1  minutes , Now calculating for Verse 1.6
ScrollDepth(96%) AND Time(1.14 minutes ) Then  

Completed else
Incompleted

# Features:
ScrollDepth Component:
•	Monitors user scrolling within specific verses.
•	Logs scroll depth, time spent, and timestamp to Firebase Firestore.
•	Stops tracking when the user scrolls back up or navigates away from the page.

ScrollDataTable Component:
•	Retrieves scroll data from Firestore and displays it in a table.
•	Paginates the scroll data for better readability.
•	Indicates the status of each verse based on scroll depth and time spent compared to estimated times.

# Usage:
ScrollDepth Component:
•	Import the ScrollDepth component into your React application.
•	Pass the verse prop to specify the verse being tracked.
•	Ensure Firebase Firestore is properly configured for data storage.

ScrollDataTable Component:
•	Import the ScrollDataTable component into your React application.
•	Place the component where you want to display the scroll data table.
•	Ensure Firebase Firestore is properly configured for data retrieval.

# Estimated Times:
The verseEstimatedTimes object contains estimated reading times (in minutes) for each verse.These times are used to compare against actual time spent by users for status indication.
# Pagination:
It stores maximum 25 rows and keeps the latest data on the top of the table. If data is not available then that particular button will be displayed in Red colour and the cursor will not be available on hovering the button , otherwise the buttons will be displayed in grey colour.
Best way to use : Open the verse page and scroll in downward direction while reading the contents and once completed use the ‘Next Button’ to go to next page.




Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
