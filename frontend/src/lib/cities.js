import { cities } from 'countries-list';

export default function handler(req, res) {
  const { country } = req.query;
  

  const countryCities = cities[country] || [];
  const cityList = Object.values(countryCities).map(city => ({
    value: city.name.toLowerCase(),
    label: city.name
  }));

  res.status(200).json(cityList);
}