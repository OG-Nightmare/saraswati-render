async function listVehicles() {
  try {
    const baseURL = 'https://saraswati-final.parikshitkapoor2.workers.dev/api';
    const res = await fetch(`${baseURL}/vehicles?limit=100`);
    if (!res.ok) {
      console.error('Failed to fetch:', res.status);
      return;
    }
    const data = await res.json();
    const vehicles = Array.isArray(data?.vehicles) ? data.vehicles : (Array.isArray(data) ? data : []);
    console.log(`Total vehicles in DB: ${vehicles.length}`);
    vehicles.forEach(v => {
      console.log(`- ${v.title} (${v._id}) [images count: ${v.images?.length || 0}]`);
    });
  } catch (err) {
    console.error('Error:', err.message);
  }
}
listVehicles();
