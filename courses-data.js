/* ════════════════════════════════════════════════
   PKA Study — courses-data.js
   Dữ liệu từ vựng cho các bộ tài liệu
════════════════════════════════════════════════ */

window.COURSES_DATA = {

    /* ══════════════════════════════════════
       BỘ 1 — TOEIC CƠ BẢN (Tiếng Anh)
       id phải khớp với data-course-id trong HTML
    ══════════════════════════════════════ */
    'toeic-basic': {
        id: 'toeic-basic',
        title: 'Bộ từ vựng TOEIC cơ bản từ 0 tới 500+',
        lang: 'en',
        topics: [

            /* ─── TOPIC 1: VĂN PHÒNG ─── */
            {
                id: 'toeic-office',
                title: '🏢 Văn phòng & Công sở',
                description: 'Từ vựng thường gặp trong môi trường làm việc văn phòng',
                wordCount: 10,
                words: [
                    {
                        id: 'w001',
                        word: 'schedule',
                        transcription: '/ˈʃɛdjuːl/',
                        mean: 'lịch trình, thời gian biểu',
                        wordtype: 'noun / verb',
                        example: 'Please check the meeting schedule for tomorrow.',
                        remembered: false
                    },
                    {
                        id: 'w002',
                        word: 'deadline',
                        transcription: '/ˈdɛdlaɪn/',
                        mean: 'thời hạn chót',
                        wordtype: 'noun',
                        example: 'We must finish the report before the deadline.',
                        remembered: false
                    },
                    {
                        id: 'w003',
                        word: 'agenda',
                        transcription: '/əˈdʒɛndə/',
                        mean: 'chương trình nghị sự',
                        wordtype: 'noun',
                        example: 'The agenda for today\'s meeting includes budget review.',
                        remembered: false
                    },
                    {
                        id: 'w004',
                        word: 'colleague',
                        transcription: '/ˈkɒliːɡ/',
                        mean: 'đồng nghiệp',
                        wordtype: 'noun',
                        example: 'My colleague helped me with the presentation.',
                        remembered: false
                    },
                    {
                        id: 'w005',
                        word: 'conference',
                        transcription: '/ˈkɒnfərəns/',
                        mean: 'hội nghị, hội thảo',
                        wordtype: 'noun',
                        example: 'The annual conference will be held in Hanoi.',
                        remembered: false
                    },
                    {
                        id: 'w006',
                        word: 'document',
                        transcription: '/ˈdɒkjʊmənt/',
                        mean: 'tài liệu, văn bản',
                        wordtype: 'noun / verb',
                        example: 'Please sign the document before submitting it.',
                        remembered: false
                    },
                    {
                        id: 'w007',
                        word: 'supervisor',
                        transcription: '/ˈsuːpəvaɪzər/',
                        mean: 'người giám sát, quản lý',
                        wordtype: 'noun',
                        example: 'I need to report to my supervisor every Monday.',
                        remembered: false
                    },
                    {
                        id: 'w008',
                        word: 'efficient',
                        transcription: '/ɪˈfɪʃnt/',
                        mean: 'hiệu quả, năng suất',
                        wordtype: 'adjective',
                        example: 'She is very efficient at managing multiple tasks.',
                        remembered: false
                    },
                    {
                        id: 'w009',
                        word: 'proposal',
                        transcription: '/prəˈpəʊzl/',
                        mean: 'đề xuất, bản đề nghị',
                        wordtype: 'noun',
                        example: 'The team submitted a proposal for a new project.',
                        remembered: false
                    },
                    {
                        id: 'w010',
                        word: 'negotiate',
                        transcription: '/nɪˈɡəʊʃieɪt/',
                        mean: 'đàm phán, thương lượng',
                        wordtype: 'verb',
                        example: 'We need to negotiate the contract terms with the client.',
                        remembered: false
                    }
                ]
            },

            /* ─── TOPIC 2: TÀI CHÍNH ─── */
            {
                id: 'toeic-finance',
                title: '💰 Tài chính & Ngân hàng',
                description: 'Từ vựng về tiền tệ, giao dịch và tài chính doanh nghiệp',
                wordCount: 10,
                words: [
                    {
                        id: 'w011',
                        word: 'budget',
                        transcription: '/ˈbʌdʒɪt/',
                        mean: 'ngân sách, ngân quỹ',
                        wordtype: 'noun / verb',
                        example: 'The company approved a larger budget for marketing.',
                        remembered: false
                    },
                    {
                        id: 'w012',
                        word: 'invoice',
                        transcription: '/ˈɪnvɔɪs/',
                        mean: 'hóa đơn, biên lai',
                        wordtype: 'noun / verb',
                        example: 'Please send the invoice to the accounting department.',
                        remembered: false
                    },
                    {
                        id: 'w013',
                        word: 'revenue',
                        transcription: '/ˈrɛvənjuː/',
                        mean: 'doanh thu',
                        wordtype: 'noun',
                        example: 'The company\'s revenue increased by 20% this year.',
                        remembered: false
                    },
                    {
                        id: 'w014',
                        word: 'profit',
                        transcription: '/ˈprɒfɪt/',
                        mean: 'lợi nhuận',
                        wordtype: 'noun / verb',
                        example: 'They made a profit of two million dollars last quarter.',
                        remembered: false
                    },
                    {
                        id: 'w015',
                        word: 'transaction',
                        transcription: '/trænˈzækʃn/',
                        mean: 'giao dịch',
                        wordtype: 'noun',
                        example: 'All transactions must be recorded in the ledger.',
                        remembered: false
                    },
                    {
                        id: 'w016',
                        word: 'deposit',
                        transcription: '/dɪˈpɒzɪt/',
                        mean: 'tiền đặt cọc, gửi tiền',
                        wordtype: 'noun / verb',
                        example: 'You need to deposit at least $500 to open the account.',
                        remembered: false
                    },
                    {
                        id: 'w017',
                        word: 'loan',
                        transcription: '/ləʊn/',
                        mean: 'khoản vay, cho vay',
                        wordtype: 'noun / verb',
                        example: 'She applied for a bank loan to start her business.',
                        remembered: false
                    },
                    {
                        id: 'w018',
                        word: 'interest rate',
                        transcription: '/ˈɪntrəst reɪt/',
                        mean: 'lãi suất',
                        wordtype: 'noun phrase',
                        example: 'The interest rate on this savings account is 3% per year.',
                        remembered: false
                    },
                    {
                        id: 'w019',
                        word: 'expenditure',
                        transcription: '/ɪkˈspɛndɪtʃər/',
                        mean: 'chi tiêu, chi phí',
                        wordtype: 'noun',
                        example: 'We need to reduce our monthly expenditure.',
                        remembered: false
                    },
                    {
                        id: 'w020',
                        word: 'shareholder',
                        transcription: '/ˈʃɛːhəʊldər/',
                        mean: 'cổ đông',
                        wordtype: 'noun',
                        example: 'The shareholders voted to approve the merger.',
                        remembered: false
                    }
                ]
            },

            /* ─── TOPIC 3: DU LỊCH ─── */
            {
                id: 'toeic-travel',
                title: '✈️ Du lịch & Vận chuyển',
                description: 'Từ vựng sử dụng khi đi du lịch, đặt vé và di chuyển',
                wordCount: 10,
                words: [
                    {
                        id: 'w021',
                        word: 'itinerary',
                        transcription: '/aɪˈtɪnərəri/',
                        mean: 'lịch trình chuyến đi',
                        wordtype: 'noun',
                        example: 'The travel agent prepared our itinerary for the trip.',
                        remembered: false
                    },
                    {
                        id: 'w022',
                        word: 'reservation',
                        transcription: '/ˌrɛzəˈveɪʃn/',
                        mean: 'đặt chỗ trước, đặt phòng',
                        wordtype: 'noun',
                        example: 'I made a reservation at the hotel for three nights.',
                        remembered: false
                    },
                    {
                        id: 'w023',
                        word: 'departure',
                        transcription: '/dɪˈpɑːtʃər/',
                        mean: 'sự khởi hành, lúc bay đi',
                        wordtype: 'noun',
                        example: 'The departure time is 8:30 AM from Terminal 2.',
                        remembered: false
                    },
                    {
                        id: 'w024',
                        word: 'customs',
                        transcription: '/ˈkʌstəmz/',
                        mean: 'hải quan',
                        wordtype: 'noun',
                        example: 'All passengers must go through customs upon arrival.',
                        remembered: false
                    },
                    {
                        id: 'w025',
                        word: 'baggage',
                        transcription: '/ˈbæɡɪdʒ/',
                        mean: 'hành lý',
                        wordtype: 'noun',
                        example: 'You are allowed one piece of carry-on baggage.',
                        remembered: false
                    },
                    {
                        id: 'w026',
                        word: 'boarding pass',
                        transcription: '/ˈbɔːdɪŋ pɑːs/',
                        mean: 'thẻ lên máy bay',
                        wordtype: 'noun phrase',
                        example: 'Please show your boarding pass at the gate.',
                        remembered: false
                    },
                    {
                        id: 'w027',
                        word: 'accommodation',
                        transcription: '/əˌkɒməˈdeɪʃn/',
                        mean: 'chỗ ở, nơi lưu trú',
                        wordtype: 'noun',
                        example: 'The accommodation package includes breakfast.',
                        remembered: false
                    },
                    {
                        id: 'w028',
                        word: 'transit',
                        transcription: '/ˈtrænsɪt/',
                        mean: 'quá cảnh, vận chuyển',
                        wordtype: 'noun / verb',
                        example: 'We have a 2-hour transit stop in Singapore.',
                        remembered: false
                    },
                    {
                        id: 'w029',
                        word: 'carrier',
                        transcription: '/ˈkærɪər/',
                        mean: 'hãng vận chuyển, hãng hàng không',
                        wordtype: 'noun',
                        example: 'Which carrier did you book your flight with?',
                        remembered: false
                    },
                    {
                        id: 'w030',
                        word: 'refund',
                        transcription: '/ˈriːfʌnd/',
                        mean: 'hoàn tiền',
                        wordtype: 'noun / verb',
                        example: 'You can get a full refund if you cancel 48 hours in advance.',
                        remembered: false
                    }
                ]
            },

            /* ─── TOPIC 4: SỨC KHỎE ─── */
            {
                id: 'toeic-health',
                title: '🏥 Sức khỏe & Y tế',
                description: 'Từ vựng liên quan đến y tế, bảo hiểm và chăm sóc sức khỏe',
                wordCount: 10,
                words: [
                    {
                        id: 'w031',
                        word: 'prescription',
                        transcription: '/prɪˈskrɪpʃn/',
                        mean: 'đơn thuốc',
                        wordtype: 'noun',
                        example: 'The doctor gave me a prescription for antibiotics.',
                        remembered: false
                    },
                    {
                        id: 'w032',
                        word: 'insurance',
                        transcription: '/ɪnˈʃʊərəns/',
                        mean: 'bảo hiểm',
                        wordtype: 'noun',
                        example: 'Does your health insurance cover dental care?',
                        remembered: false
                    },
                    {
                        id: 'w033',
                        word: 'symptom',
                        transcription: '/ˈsɪmptəm/',
                        mean: 'triệu chứng',
                        wordtype: 'noun',
                        example: 'Fever and cough are common symptoms of the flu.',
                        remembered: false
                    },
                    {
                        id: 'w034',
                        word: 'diagnosis',
                        transcription: '/ˌdaɪəɡˈnəʊsɪs/',
                        mean: 'chẩn đoán bệnh',
                        wordtype: 'noun',
                        example: 'The diagnosis confirmed it was a minor infection.',
                        remembered: false
                    },
                    {
                        id: 'w035',
                        word: 'treatment',
                        transcription: '/ˈtriːtmənt/',
                        mean: 'phương pháp điều trị',
                        wordtype: 'noun',
                        example: 'The treatment plan includes rest and medication.',
                        remembered: false
                    },
                    {
                        id: 'w036',
                        word: 'pharmacy',
                        transcription: '/ˈfɑːməsi/',
                        mean: 'nhà thuốc',
                        wordtype: 'noun',
                        example: 'You can pick up your medicine at the pharmacy downstairs.',
                        remembered: false
                    },
                    {
                        id: 'w037',
                        word: 'appointment',
                        transcription: '/əˈpɔɪntmənt/',
                        mean: 'cuộc hẹn khám bệnh',
                        wordtype: 'noun',
                        example: 'I scheduled an appointment with the doctor for Friday.',
                        remembered: false
                    },
                    {
                        id: 'w038',
                        word: 'surgeon',
                        transcription: '/ˈsɜːdʒən/',
                        mean: 'bác sĩ phẫu thuật',
                        wordtype: 'noun',
                        example: 'The surgeon performed the operation successfully.',
                        remembered: false
                    },
                    {
                        id: 'w039',
                        word: 'recover',
                        transcription: '/rɪˈkʌvər/',
                        mean: 'hồi phục, bình phục',
                        wordtype: 'verb',
                        example: 'He is expected to fully recover within two weeks.',
                        remembered: false
                    },
                    {
                        id: 'w040',
                        word: 'medication',
                        transcription: '/ˌmɛdɪˈkeɪʃn/',
                        mean: 'thuốc, dùng thuốc',
                        wordtype: 'noun',
                        example: 'Take your medication twice daily after meals.',
                        remembered: false
                    }
                ]
            },

            /* ─── TOPIC 5: MARKETING ─── */
            {
                id: 'toeic-marketing',
                title: '📣 Marketing & Kinh doanh',
                description: 'Từ vựng về quảng cáo, thương hiệu và chiến lược kinh doanh',
                wordCount: 10,
                words: [
                    {
                        id: 'w041',
                        word: 'campaign',
                        transcription: '/kæmˈpeɪn/',
                        mean: 'chiến dịch quảng cáo',
                        wordtype: 'noun / verb',
                        example: 'The marketing campaign doubled our sales.',
                        remembered: false
                    },
                    {
                        id: 'w042',
                        word: 'target audience',
                        transcription: '/ˈtɑːɡɪt ˈɔːdiəns/',
                        mean: 'đối tượng mục tiêu',
                        wordtype: 'noun phrase',
                        example: 'Our target audience is young professionals aged 25–35.',
                        remembered: false
                    },
                    {
                        id: 'w043',
                        word: 'brand',
                        transcription: '/brænd/',
                        mean: 'thương hiệu',
                        wordtype: 'noun / verb',
                        example: 'Building a strong brand is essential for long-term success.',
                        remembered: false
                    },
                    {
                        id: 'w044',
                        word: 'strategy',
                        transcription: '/ˈstrætɪdʒi/',
                        mean: 'chiến lược',
                        wordtype: 'noun',
                        example: 'We need a new strategy to enter the Asian market.',
                        remembered: false
                    },
                    {
                        id: 'w045',
                        word: 'consumer',
                        transcription: '/kənˈsjuːmər/',
                        mean: 'người tiêu dùng',
                        wordtype: 'noun',
                        example: 'Consumer feedback helped improve the product design.',
                        remembered: false
                    },
                    {
                        id: 'w046',
                        word: 'launch',
                        transcription: '/lɔːntʃ/',
                        mean: 'ra mắt, tung ra thị trường',
                        wordtype: 'noun / verb',
                        example: 'The company will launch its new product next month.',
                        remembered: false
                    },
                    {
                        id: 'w047',
                        word: 'competitor',
                        transcription: '/kəmˈpɛtɪtər/',
                        mean: 'đối thủ cạnh tranh',
                        wordtype: 'noun',
                        example: 'We must analyze our competitors\' strategies carefully.',
                        remembered: false
                    },
                    {
                        id: 'w048',
                        word: 'promotion',
                        transcription: '/prəˈməʊʃn/',
                        mean: 'khuyến mãi; thăng chức',
                        wordtype: 'noun',
                        example: 'The summer promotion attracted thousands of customers.',
                        remembered: false
                    },
                    {
                        id: 'w049',
                        word: 'distribution',
                        transcription: '/ˌdɪstrɪˈbjuːʃn/',
                        mean: 'phân phối',
                        wordtype: 'noun',
                        example: 'We need to improve our distribution network.',
                        remembered: false
                    },
                    {
                        id: 'w050',
                        word: 'survey',
                        transcription: '/ˈsɜːveɪ/',
                        mean: 'khảo sát, điều tra',
                        wordtype: 'noun / verb',
                        example: 'The survey results showed high customer satisfaction.',
                        remembered: false
                    }
                ]
            }
        ]
    },

    /* ══════════════════════════════════════
       BỘ 2 — TOPIK 1 (Tiếng Hàn)
    ══════════════════════════════════════ */
    'topik1-basic': {
        id: 'topik1-basic',
        title: 'Bộ từ vựng TOPIK 1 dành cho người mới',
        lang: 'ko',
        topics: [

            /* ─── TOPIC 1: BẢN THÂN ─── */
            {
                id: 'topik-self',
                title: '👤 Bản thân & Giới thiệu',
                description: 'Từ vựng dùng khi giới thiệu bản thân và nói về cuộc sống hàng ngày',
                wordCount: 10,
                words: [
                    {
                        id: 'k001',
                        word: '이름',
                        transcription: '[i-reum]',
                        mean: 'tên, họ tên',
                        wordtype: '명사 (danh từ)',
                        example: '제 이름은 민준이에요. (Tên tôi là Min-jun.)',
                        remembered: false
                    },
                    {
                        id: 'k002',
                        word: '나이',
                        transcription: '[na-i]',
                        mean: 'tuổi',
                        wordtype: '명사 (danh từ)',
                        example: '나이가 어떻게 돼요? (Bạn bao nhiêu tuổi?)',
                        remembered: false
                    },
                    {
                        id: 'k003',
                        word: '학생',
                        transcription: '[hak-saeng]',
                        mean: 'học sinh, sinh viên',
                        wordtype: '명사 (danh từ)',
                        example: '저는 대학교 학생이에요. (Tôi là sinh viên đại học.)',
                        remembered: false
                    },
                    {
                        id: 'k004',
                        word: '직업',
                        transcription: '[ji-geop]',
                        mean: 'nghề nghiệp, công việc',
                        wordtype: '명사 (danh từ)',
                        example: '직업이 뭐예요? (Nghề nghiệp của bạn là gì?)',
                        remembered: false
                    },
                    {
                        id: 'k005',
                        word: '취미',
                        transcription: '[chwi-mi]',
                        mean: 'sở thích',
                        wordtype: '명사 (danh từ)',
                        example: '제 취미는 독서예요. (Sở thích của tôi là đọc sách.)',
                        remembered: false
                    },
                    {
                        id: 'k006',
                        word: '좋아하다',
                        transcription: '[jo-a-ha-da]',
                        mean: 'thích, yêu thích',
                        wordtype: '동사 (động từ)',
                        example: '저는 음악을 좋아해요. (Tôi thích âm nhạc.)',
                        remembered: false
                    },
                    {
                        id: 'k007',
                        word: '살다',
                        transcription: '[sal-da]',
                        mean: 'sống, sinh sống',
                        wordtype: '동사 (động từ)',
                        example: '서울에 살아요. (Tôi sống ở Seoul.)',
                        remembered: false
                    },
                    {
                        id: 'k008',
                        word: '외국인',
                        transcription: '[oe-gu-gin]',
                        mean: 'người nước ngoài',
                        wordtype: '명사 (danh từ)',
                        example: '저는 외국인이에요. (Tôi là người nước ngoài.)',
                        remembered: false
                    },
                    {
                        id: 'k009',
                        word: '한국어',
                        transcription: '[han-gu-geo]',
                        mean: 'tiếng Hàn',
                        wordtype: '명사 (danh từ)',
                        example: '한국어를 공부해요. (Tôi đang học tiếng Hàn.)',
                        remembered: false
                    },
                    {
                        id: 'k010',
                        word: '배우다',
                        transcription: '[bae-u-da]',
                        mean: 'học, học hỏi',
                        wordtype: '동사 (động từ)',
                        example: '한국어를 열심히 배워요. (Tôi chăm chỉ học tiếng Hàn.)',
                        remembered: false
                    }
                ]
            },

            /* ─── TOPIC 2: GIA ĐÌNH ─── */
            {
                id: 'topik-family',
                title: '👨‍👩‍👧 Gia đình & Quan hệ',
                description: 'Từ vựng về các thành viên trong gia đình và mối quan hệ',
                wordCount: 10,
                words: [
                    {
                        id: 'k011',
                        word: '가족',
                        transcription: '[ga-jok]',
                        mean: 'gia đình',
                        wordtype: '명사 (danh từ)',
                        example: '가족이 몇 명이에요? (Gia đình bạn có mấy người?)',
                        remembered: false
                    },
                    {
                        id: 'k012',
                        word: '부모님',
                        transcription: '[bu-mo-nim]',
                        mean: 'bố mẹ (kính ngữ)',
                        wordtype: '명사 (danh từ)',
                        example: '부모님이 건강하세요. (Bố mẹ tôi khỏe mạnh.)',
                        remembered: false
                    },
                    {
                        id: 'k013',
                        word: '아버지',
                        transcription: '[a-beo-ji]',
                        mean: 'bố, cha',
                        wordtype: '명사 (danh từ)',
                        example: '아버지는 회사원이에요. (Bố tôi là nhân viên công ty.)',
                        remembered: false
                    },
                    {
                        id: 'k014',
                        word: '어머니',
                        transcription: '[eo-meo-ni]',
                        mean: 'mẹ',
                        wordtype: '명사 (danh từ)',
                        example: '어머니는 선생님이에요. (Mẹ tôi là giáo viên.)',
                        remembered: false
                    },
                    {
                        id: 'k015',
                        word: '형제',
                        transcription: '[hyeong-je]',
                        mean: 'anh chị em (nam)',
                        wordtype: '명사 (danh từ)',
                        example: '형제가 있어요? (Bạn có anh chị em không?)',
                        remembered: false
                    },
                    {
                        id: 'k016',
                        word: '언니',
                        transcription: '[eon-ni]',
                        mean: 'chị gái (do nữ gọi)',
                        wordtype: '명사 (danh từ)',
                        example: '제 언니는 대학생이에요. (Chị gái tôi là sinh viên đại học.)',
                        remembered: false
                    },
                    {
                        id: 'k017',
                        word: '남편',
                        transcription: '[nam-pyeon]',
                        mean: 'chồng',
                        wordtype: '명사 (danh từ)',
                        example: '남편이 요리를 잘해요. (Chồng tôi nấu ăn giỏi.)',
                        remembered: false
                    },
                    {
                        id: 'k018',
                        word: '아내',
                        transcription: '[a-nae]',
                        mean: 'vợ',
                        wordtype: '명사 (danh từ)',
                        example: '아내와 함께 여행해요. (Tôi đi du lịch cùng vợ.)',
                        remembered: false
                    },
                    {
                        id: 'k019',
                        word: '아이',
                        transcription: '[a-i]',
                        mean: 'trẻ em, con cái',
                        wordtype: '명사 (danh từ)',
                        example: '아이가 두 명 있어요. (Tôi có hai đứa con.)',
                        remembered: false
                    },
                    {
                        id: 'k020',
                        word: '함께',
                        transcription: '[ham-kke]',
                        mean: 'cùng nhau, cùng với',
                        wordtype: '부사 (trạng từ)',
                        example: '가족과 함께 식사해요. (Tôi ăn cơm cùng gia đình.)',
                        remembered: false
                    }
                ]
            },

            /* ─── TOPIC 3: DU LỊCH ─── */
            {
                id: 'topik-travel',
                title: '🗺️ Du lịch & Địa điểm',
                description: 'Từ vựng khi đi du lịch và hỏi đường tại Hàn Quốc',
                wordCount: 10,
                words: [
                    {
                        id: 'k021',
                        word: '여행',
                        transcription: '[yeo-haeng]',
                        mean: 'du lịch, chuyến đi',
                        wordtype: '명사 (danh từ)',
                        example: '한국 여행이 정말 즐거워요. (Du lịch Hàn Quốc thật thú vị.)',
                        remembered: false
                    },
                    {
                        id: 'k022',
                        word: '지하철',
                        transcription: '[ji-ha-cheol]',
                        mean: 'tàu điện ngầm, metro',
                        wordtype: '명사 (danh từ)',
                        example: '지하철로 이동해요. (Tôi di chuyển bằng tàu điện ngầm.)',
                        remembered: false
                    },
                    {
                        id: 'k023',
                        word: '버스',
                        transcription: '[beo-seu]',
                        mean: 'xe buýt',
                        wordtype: '명사 (danh từ)',
                        example: '버스가 몇 시에 와요? (Xe buýt đến lúc mấy giờ?)',
                        remembered: false
                    },
                    {
                        id: 'k024',
                        word: '호텔',
                        transcription: '[ho-tel]',
                        mean: 'khách sạn',
                        wordtype: '명사 (danh từ)',
                        example: '호텔을 예약했어요. (Tôi đã đặt phòng khách sạn.)',
                        remembered: false
                    },
                    {
                        id: 'k025',
                        word: '공항',
                        transcription: '[gong-hang]',
                        mean: 'sân bay',
                        wordtype: '명사 (danh từ)',
                        example: '공항까지 얼마나 걸려요? (Đến sân bay mất bao lâu?)',
                        remembered: false
                    },
                    {
                        id: 'k026',
                        word: '표',
                        transcription: '[pyo]',
                        mean: 'vé (tàu, xe, máy bay)',
                        wordtype: '명사 (danh từ)',
                        example: '표 한 장 주세요. (Cho tôi một vé.)',
                        remembered: false
                    },
                    {
                        id: 'k027',
                        word: '어디',
                        transcription: '[eo-di]',
                        mean: 'ở đâu, nơi nào',
                        wordtype: '대명사 (đại từ)',
                        example: '화장실이 어디에 있어요? (Nhà vệ sinh ở đâu?)',
                        remembered: false
                    },
                    {
                        id: 'k028',
                        word: '근처',
                        transcription: '[geun-cheo]',
                        mean: 'gần đây, lân cận',
                        wordtype: '명사 (danh từ)',
                        example: '근처에 편의점이 있어요? (Gần đây có cửa hàng tiện lợi không?)',
                        remembered: false
                    },
                    {
                        id: 'k029',
                        word: '얼마나',
                        transcription: '[eol-ma-na]',
                        mean: 'bao nhiêu, bao lâu',
                        wordtype: '부사 (trạng từ)',
                        example: '걸어서 얼마나 걸려요? (Đi bộ mất bao lâu?)',
                        remembered: false
                    },
                    {
                        id: 'k030',
                        word: '오른쪽',
                        transcription: '[o-reun-jjok]',
                        mean: 'bên phải',
                        wordtype: '명사 (danh từ)',
                        example: '오른쪽으로 가세요. (Hãy đi về bên phải.)',
                        remembered: false
                    }
                ]
            },

            /* ─── TOPIC 4: SỨC KHỎE ─── */
            {
                id: 'topik-health',
                title: '💊 Sức khỏe & Cơ thể',
                description: 'Từ vựng về các bộ phận cơ thể và tình trạng sức khỏe',
                wordCount: 10,
                words: [
                    {
                        id: 'k031',
                        word: '아프다',
                        transcription: '[a-peu-da]',
                        mean: 'đau, bị ốm',
                        wordtype: '형용사 (tính từ)',
                        example: '머리가 아파요. (Tôi bị đau đầu.)',
                        remembered: false
                    },
                    {
                        id: 'k032',
                        word: '병원',
                        transcription: '[byeong-won]',
                        mean: 'bệnh viện',
                        wordtype: '명사 (danh từ)',
                        example: '병원에 가야 해요. (Tôi cần đi bệnh viện.)',
                        remembered: false
                    },
                    {
                        id: 'k033',
                        word: '약',
                        transcription: '[yak]',
                        mean: 'thuốc',
                        wordtype: '명사 (danh từ)',
                        example: '약을 먹었어요. (Tôi đã uống thuốc rồi.)',
                        remembered: false
                    },
                    {
                        id: 'k034',
                        word: '열',
                        transcription: '[yeol]',
                        mean: 'sốt, nhiệt độ cơ thể',
                        wordtype: '명사 (danh từ)',
                        example: '열이 많이 나요. (Tôi đang sốt cao.)',
                        remembered: false
                    },
                    {
                        id: 'k035',
                        word: '감기',
                        transcription: '[gam-gi]',
                        mean: 'cảm cúm, cảm lạnh',
                        wordtype: '명사 (danh từ)',
                        example: '감기에 걸렸어요. (Tôi bị cảm cúm rồi.)',
                        remembered: false
                    },
                    {
                        id: 'k036',
                        word: '건강',
                        transcription: '[geon-gang]',
                        mean: 'sức khỏe',
                        wordtype: '명사 (danh từ)',
                        example: '건강이 제일 중요해요. (Sức khỏe là quan trọng nhất.)',
                        remembered: false
                    },
                    {
                        id: 'k037',
                        word: '손',
                        transcription: '[son]',
                        mean: 'tay, bàn tay',
                        wordtype: '명사 (danh từ)',
                        example: '손을 씻어요. (Tôi rửa tay.)',
                        remembered: false
                    },
                    {
                        id: 'k038',
                        word: '눈',
                        transcription: '[nun]',
                        mean: 'mắt; tuyết',
                        wordtype: '명사 (danh từ)',
                        example: '눈이 피로해요. (Mắt tôi mỏi.)',
                        remembered: false
                    },
                    {
                        id: 'k039',
                        word: '쉬다',
                        transcription: '[swi-da]',
                        mean: 'nghỉ ngơi',
                        wordtype: '동사 (động từ)',
                        example: '집에서 쉬어요. (Tôi nghỉ ngơi ở nhà.)',
                        remembered: false
                    },
                    {
                        id: 'k040',
                        word: '운동',
                        transcription: '[un-dong]',
                        mean: 'thể dục, vận động',
                        wordtype: '명사 (danh từ)',
                        example: '매일 운동을 해요. (Tôi tập thể dục mỗi ngày.)',
                        remembered: false
                    }
                ]
            },

            /* ─── TOPIC 5: ĂN UỐNG ─── */
            {
                id: 'topik-food',
                title: '🍜 Ăn uống & Nhà hàng',
                description: 'Từ vựng khi gọi đồ ăn, vào nhà hàng và nói về ẩm thực Hàn',
                wordCount: 10,
                words: [
                    {
                        id: 'k041',
                        word: '음식',
                        transcription: '[eum-sik]',
                        mean: 'đồ ăn, thức ăn',
                        wordtype: '명사 (danh từ)',
                        example: '한국 음식을 좋아해요. (Tôi thích đồ ăn Hàn Quốc.)',
                        remembered: false
                    },
                    {
                        id: 'k042',
                        word: '식당',
                        transcription: '[sik-dang]',
                        mean: 'nhà hàng, quán ăn',
                        wordtype: '명사 (danh từ)',
                        example: '근처 식당에 가요. (Tôi đến nhà hàng gần đây.)',
                        remembered: false
                    },
                    {
                        id: 'k043',
                        word: '메뉴',
                        transcription: '[me-nyu]',
                        mean: 'thực đơn, menu',
                        wordtype: '명사 (danh từ)',
                        example: '메뉴를 보여 주세요. (Cho tôi xem thực đơn.)',
                        remembered: false
                    },
                    {
                        id: 'k044',
                        word: '맛있다',
                        transcription: '[ma-sit-da]',
                        mean: 'ngon',
                        wordtype: '형용사 (tính từ)',
                        example: '이 김치찌개가 정말 맛있어요. (Món kimchi jjigae này thật ngon.)',
                        remembered: false
                    },
                    {
                        id: 'k045',
                        word: '주문',
                        transcription: '[ju-mun]',
                        mean: 'gọi món, đặt hàng',
                        wordtype: '명사 (danh từ)',
                        example: '주문할게요. (Cho tôi gọi món.)',
                        remembered: false
                    },
                    {
                        id: 'k046',
                        word: '계산',
                        transcription: '[gye-san]',
                        mean: 'thanh toán, tính tiền',
                        wordtype: '명사 (danh từ)',
                        example: '계산해 주세요. (Tính tiền cho tôi.)',
                        remembered: false
                    },
                    {
                        id: 'k047',
                        word: '물',
                        transcription: '[mul]',
                        mean: 'nước, nước uống',
                        wordtype: '명사 (danh từ)',
                        example: '물 한 잔 주세요. (Cho tôi một ly nước.)',
                        remembered: false
                    },
                    {
                        id: 'k048',
                        word: '맵다',
                        transcription: '[maep-da]',
                        mean: 'cay',
                        wordtype: '형용사 (tính từ)',
                        example: '너무 매워요. (Cay quá.)',
                        remembered: false
                    },
                    {
                        id: 'k049',
                        word: '배고프다',
                        transcription: '[bae-go-peu-da]',
                        mean: 'đói bụng',
                        wordtype: '형용사 (tính từ)',
                        example: '너무 배고파요. (Tôi đói bụng quá.)',
                        remembered: false
                    },
                    {
                        id: 'k050',
                        word: '먹다',
                        transcription: '[meok-da]',
                        mean: 'ăn',
                        wordtype: '동사 (động từ)',
                        example: '같이 밥 먹어요. (Chúng ta cùng ăn cơm nhé.)',
                        remembered: false
                    }
                ]
            }
        ]
    }
};