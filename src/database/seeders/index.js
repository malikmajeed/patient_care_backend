const { connectDB, db } = require('../index');
const { encryptPassword } = require('../../utils/encrypt_password.utils');
const {
    User,
    Admin,
    Patient,
    Nurse,
    ServiceCategory,
    CareRequirement,
    Booking,
    Payment,
    Review,
    Document,
    WorkSchedule,
    NurseSkill,
    RequiredService,
    PatientAddress,
    Notification
} = require('../../models');

const seedDatabase = async () => {
    try {
        console.log('Starting database seeding...');
        
        // Connect to database
        await connectDB();
        
        // Clear existing data (optional - comment out if you want to keep existing data)
        console.log('Clearing existing data...');
        await Notification.destroy({ where: {}, force: true });
        await PatientAddress.destroy({ where: {}, force: true });
        await RequiredService.destroy({ where: {}, force: true });
        await NurseSkill.destroy({ where: {}, force: true });
        await WorkSchedule.destroy({ where: {}, force: true });
        await Document.destroy({ where: {}, force: true });
        await Review.destroy({ where: {}, force: true });
        await Payment.destroy({ where: {}, force: true });
        await Booking.destroy({ where: {}, force: true });
        await CareRequirement.destroy({ where: {}, force: true });
        await ServiceCategory.destroy({ where: {}, force: true });
        await Nurse.destroy({ where: {}, force: true });
        await Patient.destroy({ where: {}, force: true });
        await Admin.destroy({ where: {}, force: true });
        await User.destroy({ where: {}, force: true });
        
        // Hash password for admin
        const adminPasswordHash = await encryptPassword('Admin@123');
        
        // ========== SEED USERS ==========
        console.log('Seeding users...');
        const users = await User.bulkCreate([
            {
                user_ID: 'USR0000001',
                username: 'admin',
                email: 'admin@gmail.com',
                first_name: 'Admin',
                last_name: 'User',
                password_hash: adminPasswordHash,
                role: 'admin',
                is_verified: true,
                is_active: true
            },
            {
                user_ID: 'USR0000002',
                username: 'nurse1',
                email: 'nurse1@example.com',
                first_name: 'Sarah',
                last_name: 'Johnson',
                gender: 'female',
                phone_number: '+1234567890',
                password_hash: await encryptPassword('Nurse@123'),
                role: 'nurse',
                is_verified: true,
                is_active: true
            },
            {
                user_ID: 'USR0000003',
                username: 'nurse2',
                email: 'nurse2@example.com',
                first_name: 'Michael',
                last_name: 'Chen',
                gender: 'male',
                phone_number: '+1234567891',
                password_hash: await encryptPassword('Nurse@123'),
                role: 'nurse',
                is_verified: true,
                is_active: true
            },
            {
                user_ID: 'USR0000004',
                username: 'patient1',
                email: 'patient1@example.com',
                first_name: 'John',
                last_name: 'Doe',
                gender: 'male',
                phone_number: '+1234567892',
                password_hash: await encryptPassword('Patient@123'),
                role: 'patient',
                is_verified: true,
                is_active: true
            },
            {
                user_ID: 'USR0000005',
                username: 'patient2',
                email: 'patient2@example.com',
                first_name: 'Jane',
                last_name: 'Smith',
                gender: 'female',
                phone_number: '+1234567893',
                password_hash: await encryptPassword('Patient@123'),
                role: 'patient',
                is_verified: true,
                is_active: true
            },
            {
                user_ID: 'USR0000006',
                username: 'nurse3',
                email: 'nurse3@example.com',
                first_name: 'Emily',
                last_name: 'Davis',
                gender: 'female',
                phone_number: '+1234567894',
                password_hash: await encryptPassword('Nurse@123'),
                role: 'nurse',
                is_verified: true,
                is_active: true
            },
            {
                user_ID: 'USR0000007',
                username: 'nurse4',
                email: 'nurse4@example.com',
                first_name: 'David',
                last_name: 'Wilson',
                gender: 'male',
                phone_number: '+1234567895',
                password_hash: await encryptPassword('Nurse@123'),
                role: 'nurse',
                is_verified: true,
                is_active: true
            }
        ]);
        console.log(`✓ Created ${users.length} users`);
        
        // ========== SEED ADMIN ==========
        console.log('Seeding admin...');
        const admins = await Admin.bulkCreate([
            {
                admin_ID: 'ADM001',
                user_ID: 'USR0000001',
                role: 'superadmin'
            }
        ]);
        console.log(`✓ Created ${admins.length} admin`);
        
        // ========== SEED NURSES ==========
        console.log('Seeding nurses...');
        const nurses = await Nurse.bulkCreate([
            {
                nurse_ID: 'NRS001',
                user_ID: 'USR0000002',
                address: '123 Medical Center Dr, City, State 12345',
                verification_status: 'verified',
                experience_level: 'expert',
                avg_rating: 4.8,
                total_reviews: 15,
                years_of_experience: 10,
                hourly_rate: 75.00,
                latitude: 40.7128,
                longitude: -74.0060,
                current_availability: true
            },
            {
                nurse_ID: 'NRS002',
                user_ID: 'USR0000003',
                address: '456 Health Ave, City, State 12346',
                verification_status: 'verified',
                experience_level: 'intermediate',
                avg_rating: 4.5,
                total_reviews: 8,
                years_of_experience: 5,
                hourly_rate: 60.00,
                latitude: 40.7580,
                longitude: -73.9855,
                current_availability: true
            },
            {
                nurse_ID: 'NRS003',
                user_ID: 'USR0000006',
                address: '789 Care Lane, City, State 12349',
                verification_status: 'pending',
                experience_level: 'beginner',
                avg_rating: 0,
                total_reviews: 0,
                years_of_experience: 2,
                hourly_rate: 45.00,
                latitude: 40.7282,
                longitude: -73.9942,
                current_availability: false
            },
            {
                nurse_ID: 'NRS004',
                user_ID: 'USR0000007',
                address: '321 Wellness Blvd, City, State 12350',
                verification_status: 'verified',
                experience_level: 'expert',
                avg_rating: 4.9,
                total_reviews: 22,
                years_of_experience: 15,
                hourly_rate: 85.00,
                latitude: 40.7505,
                longitude: -73.9934,
                current_availability: true
            }
        ]);
        console.log(`✓ Created ${nurses.length} nurses`);
        
        // ========== SEED PATIENTS ==========
        console.log('Seeding patients...');
        const patients = await Patient.bulkCreate([
            {
                patient_ID: 'PAT001',
                user_ID: 'USR0000004',
                address: '789 Home St, City, State 12347',
                latitude: 40.7282,
                longitude: -73.9942
            },
            {
                patient_ID: 'PAT002',
                user_ID: 'USR0000005',
                address: '321 Care Blvd, City, State 12348',
                latitude: 40.7505,
                longitude: -73.9934
            }
        ]);
        console.log(`✓ Created ${patients.length} patients`);
        
        // ========== SEED SERVICE CATEGORIES ==========
        console.log('Seeding service categories...');
        const serviceCategories = await ServiceCategory.bulkCreate([
            {
                category_ID: 'CAT001',
                category_name: 'Post-Operative Care'
            },
            {
                category_ID: 'CAT002',
                category_name: 'Elderly Care'
            },
            {
                category_ID: 'CAT003',
                category_name: 'Pediatric Care'
            },
            {
                category_ID: 'CAT004',
                category_name: 'Medication Management'
            },
            {
                category_ID: 'CAT005',
                category_name: 'Chronic Illness Care'
            },
            {
                category_ID: 'CAT006',
                category_name: 'Disability Support'
            },
            {
                category_ID: 'CAT007',
                category_name: 'Mental Health Support'
            },
            {
                category_ID: 'CAT008',
                category_name: 'Palliative Care'
            }
        ]);
        console.log(`✓ Created ${serviceCategories.length} service categories`);
        
        // ========== SEED NURSE SKILLS ==========
        console.log('Seeding nurse skills...');
        const nurseSkills = await NurseSkill.bulkCreate([
            {
                nurse_ID: 'NRS001',
                category_ID: 'CAT001'
            },
            {
                nurse_ID: 'NRS001',
                category_ID: 'CAT002'
            },
            {
                nurse_ID: 'NRS001',
                category_ID: 'CAT004'
            },
            {
                nurse_ID: 'NRS002',
                category_ID: 'CAT002'
            },
            {
                nurse_ID: 'NRS002',
                category_ID: 'CAT003'
            },
            {
                nurse_ID: 'NRS002',
                category_ID: 'CAT005'
            }
        ]);
        console.log(`✓ Created ${nurseSkills.length} nurse skills`);
        
        // ========== SEED CARE REQUIREMENTS ==========
        console.log('Seeding care requirements...');
        const careRequirements = await CareRequirement.bulkCreate([
            {
                req_ID: 'REQ001',
                symptoms_problems: 'Post-surgery recovery, needs assistance with daily activities and medication management',
                hours_per_day: 8,
                date_time_of_service: new Date('2024-12-20T09:00:00'),
                patient_ID: 'PAT001'
            },
            {
                req_ID: 'REQ002',
                symptoms_problems: 'Elderly care, needs help with mobility and companionship',
                hours_per_day: 6,
                date_time_of_service: new Date('2024-12-22T10:00:00'),
                patient_ID: 'PAT002'
            }
        ]);
        console.log(`✓ Created ${careRequirements.length} care requirements`);
        
        // ========== SEED REQUIRED SERVICES ==========
        console.log('Seeding required services...');
        const requiredServices = await RequiredService.bulkCreate([
            {
                req_ID: 'REQ001',
                category_ID: 'CAT001'
            },
            {
                req_ID: 'REQ001',
                category_ID: 'CAT004'
            },
            {
                req_ID: 'REQ002',
                category_ID: 'CAT002'
            }
        ]);
        console.log(`✓ Created ${requiredServices.length} required services`);
        
        // ========== SEED PATIENT ADDRESSES ==========
        console.log('Seeding patient addresses...');
        const patientAddresses = await PatientAddress.bulkCreate([
            {
                patient_ID: 'PAT001',
                label: 'Home',
                house_number: '789',
                street_address: 'Home Street',
                area: 'Downtown',
                landmark: 'Near Central Park',
                postal_code: '12347',
                contact_person: 'John Doe',
                contact_phone: '+1234567892',
                is_default: true
            },
            {
                patient_ID: 'PAT001',
                label: 'Work',
                house_number: '100',
                street_address: 'Office Building',
                area: 'Business District',
                landmark: 'Next to City Hall',
                postal_code: '12348',
                contact_person: 'John Doe',
                contact_phone: '+1234567892',
                is_default: false
            },
            {
                patient_ID: 'PAT002',
                label: 'Home',
                house_number: '321',
                street_address: 'Care Boulevard',
                area: 'Residential Area',
                landmark: 'Near Hospital',
                postal_code: '12348',
                contact_person: 'Jane Smith',
                contact_phone: '+1234567893',
                is_default: true
            }
        ]);
        console.log(`✓ Created ${patientAddresses.length} patient addresses`);

        // ========== SEED BOOKINGS ==========
        console.log('Seeding bookings...');
        const bookings = await Booking.bulkCreate([
            {
                booking_ID: 'BKG001',
                booking_status: 'completed',
                total_cost: 500.00,
                payment_status: 'paid',
                booked_datetime: new Date('2024-12-15T09:00:00'),
                start_time: '09:00:00',
                end_time: '17:00:00',
                duration_hours: 8.00,
                service_category_ID: 'CAT001',
                address_ID: patientAddresses[0].address_ID,
                special_instructions: 'Patient needs assistance with post-surgery recovery. Please bring medical supplies.',
                emergency_contact: '+1234567892',
                invoice_ID: 'INV001',
                patient_ID: 'PAT001',
                nurse_ID: 'NRS001'
            },
            {
                booking_ID: 'BKG002',
                booking_status: 'pending_nurse_approval',
                total_cost: 400.00,
                payment_status: 'unpaid',
                booked_datetime: new Date('2024-12-25T10:00:00'),
                start_time: '10:00:00',
                end_time: '16:00:00',
                duration_hours: 6.00,
                service_category_ID: 'CAT002',
                address_ID: patientAddresses[2].address_ID,
                special_instructions: 'Elderly care, needs help with mobility',
                emergency_contact: '+1234567893',
                invoice_ID: null,
                patient_ID: 'PAT002',
                nurse_ID: 'NRS002'
            },
            {
                booking_ID: 'BKG003',
                booking_status: 'confirmed',
                total_cost: 600.00,
                payment_status: 'paid',
                booked_datetime: new Date('2024-12-23T08:00:00'),
                start_time: '08:00:00',
                end_time: '18:00:00',
                duration_hours: 10.00,
                service_category_ID: 'CAT004',
                address_ID: patientAddresses[0].address_ID,
                special_instructions: 'Medication management for chronic condition',
                emergency_contact: '+1234567892',
                invoice_ID: 'INV002',
                patient_ID: 'PAT001',
                nurse_ID: 'NRS004'
            },
            {
                booking_ID: 'BKG004',
                booking_status: 'in_progress',
                total_cost: 450.00,
                payment_status: 'paid',
                booked_datetime: new Date('2024-12-20T09:00:00'),
                start_time: '09:00:00',
                end_time: '15:00:00',
                duration_hours: 6.00,
                service_category_ID: 'CAT003',
                address_ID: patientAddresses[2].address_ID,
                special_instructions: 'Pediatric care for 5-year-old',
                emergency_contact: '+1234567893',
                invoice_ID: 'INV003',
                patient_ID: 'PAT002',
                nurse_ID: 'NRS002'
            }
        ]);
        console.log(`✓ Created ${bookings.length} bookings`);
        
        // ========== SEED PAYMENTS ==========
        console.log('Seeding payments...');
        const payments = await Payment.bulkCreate([
            {
                payment_ID: 'PAY001',
                transaction_date: new Date('2024-12-15T14:30:00'),
                amount: 500.00,
                payment_method: 'card',
                status: 'successful',
                transaction_details: 'Card ending in 1234',
                booking_ID: 'BKG001'
            },
            {
                payment_ID: 'PAY002',
                transaction_date: new Date('2024-12-18T16:45:00'),
                amount: 400.00,
                payment_method: 'bank_transfer',
                status: 'pending',
                transaction_details: 'Bank transfer pending',
                booking_ID: 'BKG002'
            }
        ]);
        console.log(`✓ Created ${payments.length} payments`);
        
        // ========== SEED REVIEWS ==========
        console.log('Seeding reviews...');
        const reviews = await Review.bulkCreate([
            {
                review_ID: 'REV001',
                rating_score: 5,
                written_review: 'Excellent care! Sarah was very professional and caring.',
                review_date: new Date('2024-12-21T12:00:00'),
                patient_ID: 'PAT001',
                nurse_ID: 'NRS001',
                booking_ID: 'BKG001'
            },
            {
                review_ID: 'REV002',
                rating_score: 4,
                written_review: 'Good service, very helpful nurse.',
                review_date: new Date('2024-12-19T15:30:00'),
                patient_ID: 'PAT002',
                nurse_ID: 'NRS002',
                booking_ID: 'BKG002'
            }
        ]);
        console.log(`✓ Created ${reviews.length} reviews`);
        
        // ========== SEED DOCUMENTS ==========
        console.log('Seeding documents...');
        const documents = await Document.bulkCreate([
            {
                doc_ID: 'DOC001',
                nurse_ID: 'NRS001',
                attachment_url: 'https://example.com/certificates/nurse1-rn-cert.pdf',
                issuing_authority: 'State Nursing Board',
                issue_date: new Date('2020-06-15'),
                document_type: 'certification'
            },
            {
                doc_ID: 'DOC002',
                nurse_ID: 'NRS001',
                attachment_url: 'https://example.com/diplomas/nurse1-degree.pdf',
                issuing_authority: 'Medical University',
                issue_date: new Date('2018-05-20'),
                document_type: 'diploma'
            },
            {
                doc_ID: 'DOC003',
                nurse_ID: 'NRS002',
                attachment_url: 'https://example.com/certificates/nurse2-rn-cert.pdf',
                issuing_authority: 'State Nursing Board',
                issue_date: new Date('2019-08-10'),
                document_type: 'certification'
            },
            {
                doc_ID: 'DOC004',
                nurse_ID: 'NRS003',
                attachment_url: 'https://example.com/certificates/nurse3-rn-cert.pdf',
                issuing_authority: 'State Nursing Board',
                issue_date: new Date('2022-03-20'),
                document_type: 'certification'
            },
            {
                doc_ID: 'DOC005',
                nurse_ID: 'NRS004',
                attachment_url: 'https://example.com/certificates/nurse4-rn-cert.pdf',
                issuing_authority: 'State Nursing Board',
                issue_date: new Date('2009-11-10'),
                document_type: 'certification'
            },
            {
                doc_ID: 'DOC006',
                nurse_ID: 'NRS004',
                attachment_url: 'https://example.com/certificates/nurse4-advanced-cert.pdf',
                issuing_authority: 'Advanced Nursing Council',
                issue_date: new Date('2015-07-15'),
                document_type: 'certification'
            }
        ]);
        console.log(`✓ Created ${documents.length} documents`);
        
        // ========== SEED WORK SCHEDULES ==========
        console.log('Seeding work schedules...');
        const workSchedules = await WorkSchedule.bulkCreate([
            {
                work_id: 'WRK001',
                nurse_ID: 'NRS001',
                day: 'monday',
                time_range: '09:00-17:00'
            },
            {
                work_id: 'WRK002',
                nurse_ID: 'NRS001',
                day: 'tuesday',
                time_range: '09:00-17:00'
            },
            {
                work_id: 'WRK003',
                nurse_ID: 'NRS001',
                day: 'wednesday',
                time_range: '09:00-17:00'
            },
            {
                work_id: 'WRK004',
                nurse_ID: 'NRS002',
                day: 'monday',
                time_range: '10:00-18:00'
            },
            {
                work_id: 'WRK005',
                nurse_ID: 'NRS002',
                day: 'wednesday',
                time_range: '10:00-18:00'
            },
            {
                work_id: 'WRK006',
                nurse_ID: 'NRS002',
                day: 'friday',
                time_range: '10:00-18:00'
            }
        ]);
        console.log(`✓ Created ${workSchedules.length} work schedules`);

        // ========== SEED NOTIFICATIONS ==========
        console.log('Seeding notifications...');
        const notifications = await Notification.bulkCreate([
            {
                user_ID: 'USR0000002',
                user_type: 'nurse',
                type: 'booking_request',
                title: 'New Booking Request',
                message: 'You have received a new booking request from John Doe',
                related_entity_type: 'booking',
                related_entity_ID: 'BKG002',
                is_read: false
            },
            {
                user_ID: 'USR0000004',
                user_type: 'patient',
                type: 'booking_confirmed',
                title: 'Booking Confirmed',
                message: 'Your booking with Sarah Johnson has been confirmed',
                related_entity_type: 'booking',
                related_entity_ID: 'BKG001',
                is_read: true
            },
            {
                user_ID: 'USR0000001',
                user_type: 'admin',
                type: 'nurse_verification',
                title: 'Nurse Verification Pending',
                message: 'Emily Davis has submitted documents for verification',
                related_entity_type: 'nurse',
                related_entity_ID: 'NRS003',
                is_read: false
            },
            {
                user_ID: 'USR0000005',
                user_type: 'patient',
                type: 'booking_reminder',
                title: 'Upcoming Booking',
                message: 'You have a booking scheduled for tomorrow at 10:00 AM',
                related_entity_type: 'booking',
                related_entity_ID: 'BKG002',
                is_read: false
            },
            {
                user_ID: 'USR0000002',
                user_type: 'nurse',
                type: 'review_received',
                title: 'New Review',
                message: 'You received a 5-star review from John Doe',
                related_entity_type: 'review',
                related_entity_ID: 'REV001',
                is_read: true
            }
        ]);
        console.log(`✓ Created ${notifications.length} notifications`);
        
        console.log('\n✅ Database seeding completed successfully!');
        console.log('\n📋 Summary:');
        console.log(`   - Users: ${users.length}`);
        console.log(`   - Admins: ${admins.length}`);
        console.log(`   - Nurses: ${nurses.length}`);
        console.log(`   - Patients: ${patients.length}`);
        console.log(`   - Service Categories: ${serviceCategories.length}`);
        console.log(`   - Nurse Skills: ${nurseSkills.length}`);
        console.log(`   - Care Requirements: ${careRequirements.length}`);
        console.log(`   - Required Services: ${requiredServices.length}`);
        console.log(`   - Bookings: ${bookings.length}`);
        console.log(`   - Payments: ${payments.length}`);
        console.log(`   - Reviews: ${reviews.length}`);
        console.log(`   - Documents: ${documents.length}`);
        console.log(`   - Work Schedules: ${workSchedules.length}`);
        console.log(`   - Patient Addresses: ${patientAddresses.length}`);
        console.log(`   - Notifications: ${notifications.length}`);
        console.log('\n🔑 Admin Login Credentials:');
        console.log('   Email: admin@gmail.com');
        console.log('   Password: Admin@123');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run seeder if called directly
if (require.main === module) {
    seedDatabase();
}

module.exports = { seedDatabase };

