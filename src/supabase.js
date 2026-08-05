import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bwmdxghbztnxtxqerifv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3bWR4Z2hienRueHR4cWVyaWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNjc3MDMsImV4cCI6MjA3Mjk0MzcwM30.H8dUCTVfJIBBPp-UlGGI-xqseWSuyOwoPOJFVgVeUrM'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
