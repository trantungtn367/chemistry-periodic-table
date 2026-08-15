import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, runTransaction } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBUa1QrwDrAKeYedS6uZGfZ_IPVP1Yhq28",
    authDomain: "periodic-table-15054.firebaseapp.com",
    databaseURL: "https://periodic-table-15054-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "periodic-table-15054",
    storageBucket: "periodic-table-15054.firebasestorage.app",
    messagingSenderId: "726819041781",
    appId: "1:726819041781:web:0fd582b9f275fc32e030bc",
};

function countPageView() {
    try {
        const app = initializeApp(firebaseConfig);
        const database = getDatabase(app);
        const pageViewsRef = ref(database, "stats/pageViews");
        runTransaction(pageViewsRef, (currentValue) => (currentValue || 0) + 1)
            .then(() => {
                console.log("[stats] Page view counted.");
            })
            .catch((error) => {
                console.warn("[stats] Không thể tăng pageViews:", error);
            });
    } catch (error) {
        console.warn("[stats] Không thể khởi tạo Firebase:", error);
    }
}

countPageView();
