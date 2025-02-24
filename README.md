# Agri-Learning Platform

## Description

The Agri-Learning Platform is a web-based application designed to provide agricultural education and testing. It includes features for user authentication, topic-based learning, online tests, and score tracking.

## Features

*   **User Authentication:** Secure login and registration system.
*   **Topic-Based Learning:** Structured learning content organized by week and topic.
*   **Online Tests:** Interactive tests with time limits and scoring.
*   **Scoreboard:** Displays user performance metrics (score, percentage, etc.).
*   **Admin Panel:** Allows administrators to view and manage user test results.
*   **PDF Report Generation:** Generates downloadable PDF reports of test results.

## Technologies Used

*   HTML
*   CSS
    *   Bootstrap (for layout and basic components)
    *   Tailwind CSS (for utility-first styling)
*   JavaScript
*   jsPDF (for PDF generation)

## Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone [repository URL]
    cd agri-learning-platform
    ```

2.  **Open HTML files directly in a web browser:**

    *   No web server is required for basic functionality.
    *   Open `index.html` to start using the application.

3.  **To use Bootstrap and Tailwind CSS:**

    *Make sure Bootstrap CSS file with `bootstrap.css` to `css/`
    *To to tailwind and make sure it is https://cdn.tailwindcss.com is used.

4.  **Simulated Backend (JSON Files):**

    *   User data is stored in `backend/results/users.json`. You can manually add or modify user accounts in this file.
    *   Test questions and answers are stored in `backend/results/test_data.json`.
    *   Test results are stored in local storage.
    *   The `backend` is local storage for this page.
* There is an admin account made for all tests
username: agri.developer2402
password 2402

5.  **Set up and store Local storage code**

    * Local storage is used to test all the information
    * This is very important, or website may malfunction
*   **All important points are mentioned within the page, if facing issues please contact me**

## Notes

*   This is a simplified application using local storage. In a production environment, you would use a proper backend server and database for user authentication and data persistence.
*   **Security:** Do not store sensitive information in local storage in a real application.
*   **Customization:** You can customize the styling by modifying the CSS files.
*   **Known Issues:**

    *   The tests are basic so it may not function as intented and is only a template
    *   May have minor bugs not sure of yet due to testings

## Contact

Samaksh Rastogi

samakshrastogi885@gmail.com