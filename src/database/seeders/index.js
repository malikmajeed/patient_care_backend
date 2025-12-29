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
    RequiredService
} = require('../../models');

const seedDatabase = async () => {
    try {
        console.log('Starting database seeding...');
        
        // Connect to database
        await connectDB();
        
        // Clear existing data (optional - comment out if you want to keep existing data)
        console.log('Clearing existing data...');
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
                latitude: 40.7580,
                longitude: -73.9855,
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
        
        // ========== SEED BOOKINGS ==========
        console.log('Seeding bookings...');
        const bookings = await Booking.bulkCreate([
            {
                booking_ID: 'BKG001',
                booking_status: 'confirmed',
                total_cost: 500.00,
                payment_status: 'paid',
                booked_datetime: new Date('2024-12-20T09:00:00'),
                invoice_ID: 'INV001',
                patient_ID: 'PAT001',
                nurse_ID: 'NRS001'
            },
            {
                booking_ID: 'BKG002',
                booking_status: 'pending',
                total_cost: 400.00,
                payment_status: 'unpaid',
                booked_datetime: new Date('2024-12-22T10:00:00'),
                invoice_ID: null,
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

