import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ✅ Cấu hình Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDB2Ce38ZvWXTG8H4AM-dXqdlYUxlfx8kc",
    authDomain: "get-otp-acc9b.firebaseapp.com",
    projectId: "get-otp-acc9b",
    storageBucket: "get-otp-acc9b.appspot.com",
    messagingSenderId: "733330697990",
    appId: "1:733330697990:web:fafa705d1c33527471f887",
    measurementId: "G-E0NH0M8GN4"
};

// ✅ Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 📧 Kiểm tra email
async function checkEmail() {
    const emailInput = document.getElementById("email")?.value.trim();
    if (!emailInput) return alert("Vui lòng nhập email");

    const q = query(collection(db, "users"), where("email", "==", emailInput));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        alert("Email hợp lệ. Hệ thống đang quét thư, vui lòng chờ...");
        startScan(emailInput);
    } else {
        alert("Email không tồn tại trong hệ thống.");
    }
}
async function startScan() {
    try {
        const response = await fetch('https://backend-d1e9.onrender.com/scan-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });

        const data = await response.json();
        console.log("📧 Phản hồi từ server:", data);

        const emailContainer = document.getElementById('email-container');

        if (data.success) {
            if (data.otp) {
                emailContainer.innerHTML = `<p style="color:green; font-size:20px;">🔑 Mã OTP của bạn: <strong>${data.otp}</strong></p>`;
            } else if (data.click_required) {
                emailContainer.innerHTML = `<button id="receive-code" style="padding:10px; font-size:16px; background:#ff9800; color:white; border:none; cursor:pointer;">Nhận mã</button>`;
                
                document.getElementById("receive-code").addEventListener("click", startScan);
            } else {
                emailContainer.innerHTML = `<p style="color:red;">${data.message || "Không tìm thấy email phù hợp."}</p>`;
            }
        } else {
            emailContainer.innerHTML = `<p style="color:red;">❌ ${data.message}</p>`;
        }
    } catch (error) {
        console.error("❌ Lỗi khi gọi API quét email:", error);
        alert("❌ Không thể kết nối tới server. Hãy kiểm tra lại.");
    }
}

window.checkEmail = checkEmail;
