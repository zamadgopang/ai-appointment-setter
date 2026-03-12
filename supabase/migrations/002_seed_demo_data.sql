-- Insert demo tenant for development/testing
INSERT INTO tenants (id, user_id, name, plan_type, widget_greeting)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'Demo Company',
  'professional',
  'Hi! I can help you schedule appointments. What can I assist you with today?'
) ON CONFLICT (id) DO NOTHING;

-- Delete existing demo business knowledge to avoid duplicates
DELETE FROM business_knowledge WHERE tenant_id = '00000000-0000-0000-0000-000000000001';

-- Insert sample business knowledge for demo
INSERT INTO business_knowledge (tenant_id, file_name, content, file_size, file_type)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'business_hours.txt',
  'Our business hours are Monday to Friday, 9:00 AM to 5:00 PM. We are closed on weekends and major holidays.',
  200,
  'text/plain'
), (
  '00000000-0000-0000-0000-000000000001',
  'services.txt',
  'We offer the following services: Initial Consultation (30 minutes), Follow-up Appointment (20 minutes), and Extended Consultation (60 minutes).',
  180,
  'text/plain'
), (
  '00000000-0000-0000-0000-000000000001',
  'policies.txt',
  'Cancellation Policy: Please provide at least 24 hours notice for cancellations. Late cancellations may be subject to a fee.',
  150,
  'text/plain'
);
