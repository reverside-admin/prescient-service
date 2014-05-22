insert into hotel (id, name) values (1, 'Reverside Grand Hotel');

insert into hotel_department (id, name, hotel_id) values (1, 'Front of House', 1);
insert into hotel_department (id, name, hotel_id) values (2, 'Front Office', 1);
insert into hotel_department (id, name, hotel_id) values (3, 'Food and Beverage', 1);
insert into hotel_department (id, name, hotel_id) values (4, 'Seminars', 1);
insert into hotel_department (id, name, hotel_id) values (5, 'VIP Services', 1);

insert into hotel_room_type (id, room_type_name) values (1, 'Standard Room Twin');
insert into hotel_room_type (id, room_type_name) values (2, 'Standard Room Double');
insert into hotel_room_type (id, room_type_name) values (3, 'Luxury Room');
insert into hotel_room_type (id, room_type_name) values (4, 'Junior Suite');
insert into hotel_room_type (id, room_type_name) values (5, 'Luxury Suite');
insert into hotel_room_type (id, room_type_name) values (6, 'Presidential Suite');

insert into hotel_room (id, room_number, hotel_id, room_type_id) values (1, 'G010', 1, 6);
insert into hotel_room (id, room_number, hotel_id, room_type_id) values (2, 'G011', 1, 6);
insert into hotel_room (id, room_number, hotel_id, room_type_id) values (3, 'G012', 1, 5);
insert into hotel_room (id, room_number, hotel_id, room_type_id) values (4, 'G013', 1, 5);
insert into hotel_room (id, room_number, hotel_id, room_type_id) values (5, 'G014', 1, 5);
insert into hotel_room (id, room_number, hotel_id, room_type_id) values (6, 'G015', 1, 4);
insert into hotel_room (id, room_number, hotel_id, room_type_id) values (7, 'G016', 1, 4);
insert into hotel_room (id, room_number, hotel_id, room_type_id) values (8, 'G017', 1, 4);
insert into hotel_room (id, room_number, hotel_id, room_type_id) values (9, 'G018', 1, 4);
insert into hotel_room (id, room_number, hotel_id, room_type_id) values (10, 'G019', 1, 3);
insert into hotel_room (id, room_number, hotel_id, room_type_id) values (11, 'G020', 1, 3);
insert into hotel_room (id, room_number, hotel_id, room_type_id) values (12, 'U010', 1, 3);
insert into hotel_room (id, room_number, hotel_id, room_type_id) values (13, 'U011', 1, 3);
insert into hotel_room (id, room_number, hotel_id, room_type_id) values (14, 'U012', 1, 2);
insert into hotel_room (id, room_number, hotel_id, room_type_id) values (15, 'U013', 1, 2);
insert into hotel_room (id, room_number, hotel_id, room_type_id) values (16, 'U014', 1, 2);
insert into hotel_room (id, room_number, hotel_id, room_type_id) values (17, 'U015', 1, 2);
insert into hotel_room (id, room_number, hotel_id, room_type_id) values (18, 'U016', 1, 1);
insert into hotel_room (id, room_number, hotel_id, room_type_id) values (19, 'U017', 1, 1);
insert into hotel_room (id, room_number, hotel_id, room_type_id) values (20, 'U018', 1, 1);
insert into hotel_room (id, room_number, hotel_id, room_type_id) values (21, 'U019', 1, 1);
insert into hotel_room (id, room_number, hotel_id, room_type_id) values (22, 'U020', 1, 1);

insert into guest_touch_point(id, guest_touchpoint_name,  hotel_department_id) values(1, 'Porte_Cochere', 1);
insert into guest_touch_point(id, guest_touchpoint_name,  hotel_department_id) values(2, 'Guest_Parking_Area', 1);
insert into guest_touch_point(id, guest_touchpoint_name,  hotel_department_id) values(3, 'Reception_Desk',  2);
insert into guest_touch_point(id, guest_touchpoint_name,  hotel_department_id) values(4, 'Reception Lounge', 2);
insert into guest_touch_point(id, guest_touchpoint_name,  hotel_department_id) values(5, 'Concierge_Desk', 2);
insert into guest_touch_point(id, guest_touchpoint_name,  hotel_department_id) values(6, 'Lakeside_Lounge', 3);
insert into guest_touch_point(id, guest_touchpoint_name,  hotel_department_id) values(7, 'Flood_Bar', 3);
insert into guest_touch_point(id, guest_touchpoint_name,  hotel_department_id) values(8, 'Fountain_Coffee_Bar', 3);
insert into guest_touch_point(id, guest_touchpoint_name,  hotel_department_id) values(9, 'Breakwater_Restaurant', 3);
insert into guest_touch_point(id, guest_touchpoint_name,  hotel_department_id) values(10, 'The_Picnic_Spot', 3);
insert into guest_touch_point(id, guest_touchpoint_name,  hotel_department_id) values(11, 'Seminar_Porte_Cochere', 4);
insert into guest_touch_point(id, guest_touchpoint_name,  hotel_department_id) values(12, 'Seminar_Reception', 4);
insert into guest_touch_point(id, guest_touchpoint_name,  hotel_department_id) values(13, 'Seminar_Lounge', 4);
insert into guest_touch_point(id, guest_touchpoint_name,  hotel_department_id) values(14, 'VIP_Lounge', 5);

insert into user_status (id, value) values (1,'disable');
insert into user_status (id, value) values (2,'enable');

insert into user_type (id, value) values (1, 'ROLE_ADMIN');
insert into user_type (id, value) values (2, 'ROLE_MANAGER');
insert into user_type (id, value) values (3, 'ROLE_STAFF');

insert into  user(id, user_name, password, first_name, last_name, user_status_id , user_type_id, hotel_id)
values( 1, 'mrunmay', 'secret', 'Mrunmay', 'Mohanty', 2, 1, 1);

insert into user_departments (uid, did) values (1,1);
insert into user_departments (uid, did) values (1,2);
insert into user_departments (uid, did) values (1,3);
insert into user_departments (uid, did) values (1,4);
insert into user_departments (uid, did) values (1,5);

insert into user_touch_points (uid, tid) values (1, 1);
insert into user_touch_points (uid, tid) values (1, 2);
insert into user_touch_points (uid, tid) values (1, 3);
insert into user_touch_points (uid, tid) values (1, 4);
insert into user_touch_points (uid, tid) values (1, 5);
insert into user_touch_points (uid, tid) values (1, 6);
insert into user_touch_points (uid, tid) values (1, 7);
insert into user_touch_points (uid, tid) values (1, 8);
insert into user_touch_points (uid, tid) values (1, 9);
insert into user_touch_points (uid, tid) values (1, 10);
insert into user_touch_points (uid, tid) values (1, 11);
insert into user_touch_points (uid, tid) values (1, 12);
insert into user_touch_points (uid, tid) values (1, 13);
insert into user_touch_points (uid, tid) values (1, 14);

insert into hotel_guest_profile_detail
        (id, hotel_id, guest_first_name, guest_date_of_birth, guest_gender, guest_nationality, guest_passport_number, guest_preferred_name, guest_surname, guest_title)
values  (1, 1, 'John', '1988-04-21 00:00:00', 'Male', 'Indian', 'AZ74539', 'Joe', 'Smith', 'Mr');
insert into hotel_guest_profile_detail
        (id, hotel_id, guest_first_name, guest_date_of_birth, guest_gender, guest_nationality, guest_passport_number, guest_preferred_name, guest_surname, guest_title)
values  (2, 1, 'Jasmine', '1978-12-3 00:00:00', 'Female', 'SouthAfrican', 'AZ74539', 'Jas', 'Roy', 'Miss');
insert into hotel_guest_profile_detail
        (id, hotel_id, guest_first_name, guest_date_of_birth, guest_gender, guest_nationality, guest_passport_number, guest_preferred_name, guest_surname, guest_title)
values  (3, 1, 'John', '1989-01-22 00:00:00', 'Male', 'American', 'JH74535', 'John', 'Karthy', 'Mr');
insert into hotel_guest_profile_detail
        (id, hotel_id, guest_first_name, guest_date_of_birth, guest_gender, guest_nationality, guest_passport_number, guest_preferred_name, guest_surname, guest_title)
values  (4, 1, 'Robert', '1999-04-1 00:00:00', 'Male', 'Indian', 'QP74536', 'Rob', 'Alvis', 'Mr');
insert into hotel_guest_profile_detail
        (id, hotel_id, guest_first_name, guest_date_of_birth, guest_gender, guest_nationality, guest_passport_number, guest_preferred_name, guest_surname, guest_title)
values  (5, 1, 'Pooja', '1967-08-9 00:00:00', 'Female', 'Indian', 'XL74623', 'Poo', 'Das', 'Miss');
insert into hotel_guest_profile_detail
        (id, hotel_id, guest_first_name, guest_date_of_birth, guest_gender, guest_nationality, guest_passport_number, guest_preferred_name, guest_surname, guest_title)
values  (6, 1, 'Shreya', '1988-07-06 00:00:00', 'Female', 'SouthAfrican', 'KQ74959', 'sree', 'Bata', 'Miss');

insert into current_resident_guest_stay_detail
        (id, room_id, room_type_id, guest_id, arrival_time, departure_time, current_stay_ind,  hotel_id)
values  (1, 7, 1, 1, '2010-04-01 00:00:00', '2010-04-05 00:00:00', true,  1);
insert into current_resident_guest_stay_detail
        (id, room_id, room_type_id, guest_id, arrival_time, departure_time, current_stay_ind,  hotel_id)
values  (2, 6, 2,  2, '2010-04-02 00:00:00', '2010-04-06 00:00:00', false,  1);
insert into current_resident_guest_stay_detail
        (id, room_id, room_type_id, guest_id, arrival_time, departure_time, current_stay_ind,  hotel_id)
values  (3, 5, 3,  3, '2010-04-03 00:00:00', '2010-04-07 00:00:00', true,  1);
insert into current_resident_guest_stay_detail
        (id, room_id, room_type_id, guest_id, arrival_time, departure_time, current_stay_ind,   hotel_id)
values  (4, 4, 4,  4, '2010-04-03 00:00:00', '2010-04-07 00:00:00', false ,  1);
insert into current_resident_guest_stay_detail
        (id, room_id, room_type_id, guest_id, arrival_time, departure_time, current_stay_ind,   hotel_id)
values  (5, 3, 5, 5, '2010-04-03 00:00:00', '2010-04-07 00:00:00', true ,  1);
insert into current_resident_guest_stay_detail
        (id, room_id, room_type_id, guest_id, arrival_time, departure_time, current_stay_ind,   hotel_id)
values  (6, 2, 6, 6, '2010-04-03 00:00:00', '2010-04-07 00:00:00', true,  1);


insert into guest_card (id, mag_stripe_no, rfid_tag_no) values (1, 'Room-001', '40000565');
insert into guest_card (id, mag_stripe_no, rfid_tag_no) values (2, 'Room-002', '300833B2DDD9014000000000');
insert into guest_card (id, mag_stripe_no, rfid_tag_no) values (3, 'Room-003', '40000751');
insert into guest_card (id, mag_stripe_no, rfid_tag_no) values (4, 'Room-004', '40000752');
insert into guest_card (id, mag_stripe_no, rfid_tag_no) values (5, 'Room-005', '40000743');
insert into guest_card (id, mag_stripe_no, rfid_tag_no) values (6, 'Room-006', 'E2002077051901200940B612');

insert into guest_card_allocation (id, guest_card_id, guest_id, status) values (1, 1, 1, true);
insert into guest_card_allocation (id, guest_card_id, guest_id, status) values (2, 2, 2, true);
insert into guest_card_allocation (id, guest_card_id, guest_id, status) values (3, 3, 3, true);
insert into guest_card_allocation (id, guest_card_id, guest_id, status) values (4, 4, 4, true);
insert into guest_card_allocation (id, guest_card_id, guest_id, status) values (5, 5, 5, true);
insert into guest_card_allocation (id, guest_card_id, guest_id, status) values (6, 6, 6, true);
