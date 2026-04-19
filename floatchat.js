/* ════════════════════════════════════════════════
   PKA CONFESSIONS — floatchat.js
   Floating AI chat widget (index + search pages)
════════════════════════════════════════════════ */
'use strict';

(function () {
    const API_URL = 'https://platform.beeknoee.com/api/v1/chat/completions';
    const MODEL = 'llama3.1-8b';

    const SYSTEM_PROMPT = `Bạn là trợ lý AI gia sư của PKA Study — nền tảng học ngoại ngữ thông minh dành cho sinh viên và người học.

Bạn thân thiện, dễ hiểu, giải thích rõ ràng, và luôn khuyến khích người học tiến bộ.

Nhiệm vụ của bạn là:
- Giải nghĩa từ vựng, ngữ pháp (Anh / Hàn / Việt)
- Hỗ trợ luyện hội thoại, phát âm, viết câu
- Sửa lỗi và giải thích chi tiết, dễ hiểu
- Đưa ví dụ thực tế, dễ áp dụng
- Trả lời bằng tiếng Việt (trừ khi người dùng hỏi bằng tiếng Anh hoặc ngôn ngữ khác)

Lưu ý:
- Không tiết lộ thông tin cá nhân của người dùng
- Không cung cấp thông tin sai lệch hoặc gây hiểu nhầm
- Luôn giữ thái độ tích cực, khuyến khích học tập
- Trả lời ngắn gọn, súc tích (dưới 200 từ, ưu tiên dễ hiểu)

## KIẾN THỨC CHUYÊN BIỆT — ƯU TIÊN CAO NHẤT

---

### 1. AI / NGƯỜI TẠO RA HỆ THỐNG

Khi được hỏi: "Ai tạo ra hệ thống?", "AI này do ai làm?", v.v.

Cách trả lời:
- "PKA Study được phát triển bởi một nhóm sinh viên/nhà phát triển yêu thích công nghệ và giáo dục 😄"
- "Thông tin chi tiết về đội ngũ phát triển hiện không được công khai, nhưng mục tiêu là giúp việc học ngoại ngữ dễ dàng hơn!"

Không tiết lộ danh tính cụ thể.

---

### 2. HỌC TỪ VỰNG

Khi người dùng hỏi nghĩa từ, cách dùng:

Trả lời:
- Nghĩa (Việt/Anh/Hàn)
- Loại từ
- Phiên âm (nếu có)
- Ví dụ ngắn, dễ hiểu

---

### 3. NGỮ PHÁP

Khi người dùng hỏi về ngữ pháp:

Trả lời:
- Giải thích đơn giản
- Công thức
- Ví dụ rõ ràng
- So sánh nếu dễ nhầm

---

### 4. LUYỆN HỘI THOẠI

Khi người dùng muốn luyện nói:

Trả lời:
- Đưa đoạn hội thoại mẫu ngắn
- Có thể đóng vai (roleplay)
- Sửa lỗi nếu người dùng trả lời

---

### 5. SỬA LỖI

Khi người dùng viết câu:

Trả lời:
- Chỉ ra lỗi sai
- Đưa câu đúng
- Giải thích ngắn gọn

---

### 6. PKA Study LÀ GÌ?

Khi được hỏi:

Trả lời:
- PKA Study là nền tảng học ngoại ngữ thông minh
- Hỗ trợ học từ vựng, ngữ pháp, luyện tập và tra cứu nhanh
- Tập trung vào trải nghiệm học đơn giản, hiệu quả

---

### 7. VẤN ĐỀ KỸ THUẬT

Khi gặp lỗi:

Trả lời:
- Tải lại trang (F5)
- Kiểm tra kết nối mạng
- Dùng trình duyệt mới nhất
- Thử lại sau nếu hệ thống bảo trì

---

Lưu ý:
Nếu câu hỏi không thuộc các mục trên, hãy trả lời như một gia sư ngoại ngữ thân thiện, dễ hiểu, và luôn hỗ trợ người học tiến bộ.`;

    /* ── DOM ── */
    const btn = document.getElementById('floatChatBtn');
    const window_ = document.getElementById('floatChatWindow');
    const closeBtn = document.getElementById('floatChatClose');
    const messages = document.getElementById('floatChatMessages');
    const input = document.getElementById('floatChatInput');
    const sendBtn = document.getElementById('floatChatSend');

    if (!btn) return; // guard: widget không tồn tại trên trang này

    /* ── State ── */
    let isOpen = false;
    let isLoading = false;
    const history = []; // { role: 'user'|'assistant', content: string }

    /* ── Toggle ── */
    function openChat() {
        isOpen = true;
        window_.classList.remove('float-chat-closed');
        window_.classList.add('float-chat-open');
        window_.setAttribute('aria-hidden', 'false');
        input.focus();
    }
    function closeChat() {
        isOpen = false;
        window_.classList.remove('float-chat-open');
        window_.classList.add('float-chat-closed');
        window_.setAttribute('aria-hidden', 'true');
    }

    btn.addEventListener('click', () => isOpen ? closeChat() : openChat());
    closeBtn.addEventListener('click', closeChat);

    /* ── Auto-resize textarea ── */
    input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 100) + 'px';
    });

    /* ── Send on Enter (Shift+Enter = newline) ── */
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    sendBtn.addEventListener('click', sendMessage);

    /* ── Helpers ── */
    function scrollBottom() {
        messages.scrollTop = messages.scrollHeight;
    }

    function appendMsg(role, text, isMarkdown = false) {
        const div = document.createElement('div');
        div.className = `float-msg float-msg-${role === 'user' ? 'user' : 'bot'}`;

        if (isMarkdown && role === 'bot') {
            // Parse markdown to HTML
            div.innerHTML = marked.parse(text);

            // Highlight code blocks
            div.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        } else {
            div.innerHTML = `<span>${text}</span>`;
        }

        messages.appendChild(div);
        scrollBottom();
        return div;
    }

    function showTyping() {
        const div = document.createElement('div');
        div.className = 'float-msg float-msg-bot float-typing';
        div.innerHTML = '<span>●</span><span>●</span><span>●</span>';
        messages.appendChild(div);
        scrollBottom();
        return div;
    }

    /* ── Main send ── */
    async function sendMessage() {
        const text = input.value.trim();
        if (!text || isLoading) return;

        isLoading = true;
        sendBtn.disabled = true;
        input.value = '';
        input.style.height = 'auto';

        appendMsg('user', escapeHtml(text));
        history.push({ role: 'user', content: text });

        const typingEl = showTyping();

        try {
            const payload = {
                model: MODEL,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },  // ← system role đúng chuẩn
                    ...history
                ],
                max_tokens: 2048,
                temperature: 0.85,
                top_p: 0.95,
                stream: true,
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer sk-bee-c3b440a14f7a434283c95709c96c5879`,
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errText.slice(0, 200)}`);
            }

            typingEl.remove();
            const botDiv = document.createElement('div');
            botDiv.className = 'float-msg float-msg-bot';
            messages.appendChild(botDiv);

            let fullText = '';
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop(); // giữ lại dòng chưa hoàn chỉnh

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed || trimmed === 'data: [DONE]') continue;
                    if (!trimmed.startsWith('data: ')) continue;
                    try {
                        const json = JSON.parse(trimmed.slice(6));
                        const delta = json?.choices?.[0]?.delta?.content;
                        if (delta) {
                            fullText += delta;
                            const display = fullText
                                .replace(/<think>[\s\S]*?<\/think>/gi, '')
                                .replace(/<think>[\s\S]*/gi, '')
                                .trim();

                            // Render markdown real-time
                            botDiv.innerHTML = marked.parse(display);

                            // Highlight code blocks
                            botDiv.querySelectorAll('pre code').forEach((block) => {
                                hljs.highlightElement(block);
                            });

                            scrollBottom();
                        }
                    } catch (_) { }
                }
            }

            const finalText = fullText
                .replace(/<think>[\s\S]*?<\/think>/gi, '')
                .trim();

            botDiv.innerHTML = marked.parse(finalText || '(Không có phản hồi)');

            // Highlight final code blocks
            botDiv.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
            history.push({ role: 'assistant', content: finalText });

            // Giới hạn 20 lượt để tránh tràn token
            if (history.length > 20) history.splice(0, history.length - 20);

        } catch (err) {
            typingEl.remove();
            console.error('[FloatChat]', err);
            appendMsg('bot', 'Xin lỗi, hệ thống AI đang gặp sự cố. Bạn thử lại sau nhé!');
        } finally {
            isLoading = false;
            sendBtn.disabled = false;
            if (isOpen) input.focus(); // ← chỉ focus khi widget đang mở
        }
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

})();