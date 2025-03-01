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

// 🔍 Kiểm tra số điện thoại
async function checkPhone() {
    const phoneInput = document.getElementById("phone")?.value.trim();
    if (!phoneInput) return alert("Vui lòng nhập số điện thoại");

    const q = query(collection(db, "users"), where("phone", "==", phoneInput));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        document.getElementById("email-section").style.display = "block";
        alert("Số điện thoại hợp lệ. Hãy nhập email.");
    } else {
        alert("Số điện thoại không tồn tại trong hệ thống.");
    }
}

// 📧 Kiểm tra email
async function checkEmail() {
    const phoneInput = document.getElementById("phone")?.value.trim();
    const emailInput = document.getElementById("email")?.value.trim();
    if (!emailInput) return alert("Vui lòng nhập email");

    const q = query(collection(db, "users"), where("phone", "==", phoneInput), where("email", "==", emailInput));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        alert("Email khớp với số điện thoại. Hãy chọn thiết bị kết nối.");
        document.getElementById("device-section").style.display = "block";
    } else {
        alert("Email không đúng với số điện thoại đã nhập.");
    }
}

// 📺 Xác nhận thiết bị
function confirmDevice() {
    const device = document.getElementById("device")?.value;

    if (device === "tv") {
        document.getElementById("username-section").style.display = "none";
        document.getElementById("scan-message").innerText = "🔍 Đang quét email cho thiết bị TV gia đình...";
        document.getElementById("scan-section").style.display = "block";
        startScan();
    } else {
        document.getElementById("username-section").style.display = "block";
    }
}

// 👤 Xác nhận người dùng cho thiết bị cá nhân
function confirmUser() {
    document.getElementById("scan-message").innerText = "🔍 Bắt đầu quét email cho thiết bị cá nhân...";
    document.getElementById("scan-section").style.display = "block";
    startScan();
}

// 🔎 Giải mã Base64 từ server
function decodeBase64(encoded) {
    return decodeURIComponent(atob(encoded).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

// 🚀 Gửi request quét email tới backend
async function startScan() {
    alert("⏳ Hệ thống đang quét email, vui lòng chờ...");

    const device = document.getElementById("device")?.value;
    const usernameInput = (device === "tv") ? "" : document.getElementById("username")?.value?.trim();

    if (device !== "tv" && !usernameInput) {
        return alert("Vui lòng nhập tên người dùng cho thiết bị cá nhân.");
    }

    const payload = {
        device_type: device,
        username: usernameInput
    };

    console.log("📤 Gửi request quét email:", payload);

    try {
        const response = await fetch('https://get-otp-uxz9.onrender.com/scan-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("📧 Phản hồi từ server:", data);

        const emailContainer = document.getElementById('email-container');

        if (data.success && data.email_html) {
            const decodedHtml = decodeBase64(data.email_html);
            emailContainer.innerHTML = decodedHtml;
        } else {
            emailContainer.innerHTML = `<p style="color:red;">${data.message || "Không tìm thấy email phù hợp."}</p>`;
        }
    } catch (error) {
        console.error("❌ Lỗi khi gọi API quét email:", error);
        alert("❌ Không thể kết nối tới server. Hãy kiểm tra lại.");
    }
}

// 🖥 Gắn hàm vào window để gọi từ HTML
window.checkPhone = checkPhone;
window.checkEmail = checkEmail;
window.confirmDevice = confirmDevice;
window.confirmUser = confirmUser;
window.startScan = startScan;
