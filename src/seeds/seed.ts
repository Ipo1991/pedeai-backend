import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'pedeai',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: false,
});

async function seed() {
  await AppDataSource.initialize();
  console.log('✅ Conectado ao banco de dados');

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // Criar usuário de teste
    const hashedPassword = await bcrypt.hash('123456', 10);
    const userResult = await queryRunner.query(
      `INSERT INTO users (email, password, name, phone, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, NOW(), NOW()) 
       ON CONFLICT (email) DO NOTHING 
       RETURNING id`,
      ['teste@pedeai.com', hashedPassword, 'Usuário Teste', '11999999999'],
    );
    const userId = userResult.length > 0 ? userResult[0].id : null;
    console.log('✅ Usuário de teste criado/existente');

    // Criar endereço de teste
    if (userId) {
      await queryRunner.query(
        `INSERT INTO addresses (user_id, street, number, neighborhood, city, state, zip, is_default, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
         ON CONFLICT DO NOTHING`,
        [
          userId,
          'Rua das Flores',
          '123',
          'Centro',
          'São Paulo',
          'SP',
          '01310100',
          true,
        ],
      );
      console.log('✅ Endereço de teste criado');
    }

    // Restaurantes
    const restaurants = [
      {
        name: 'Pizza Bella',
        category: 'Italiana',
        rating: 4.5,
        delivery_time: '30-40 min',
        delivery_fee: 5.0,
        image: 'https://via.placeholder.com/300x200?text=Pizza+Bella',
      },
      {
        name: 'Burger House',
        category: 'Hamburguer',
        rating: 4.8,
        delivery_time: '20-30 min',
        delivery_fee: 3.5,
        image: 'https://via.placeholder.com/300x200?text=Burger+House',
      },
      {
        name: 'Sushi Master',
        category: 'Japonesa',
        rating: 4.7,
        delivery_time: '40-50 min',
        delivery_fee: 8.0,
        image: 'https://via.placeholder.com/300x200?text=Sushi+Master',
      },
      {
        name: 'Taco Loco',
        category: 'Mexicana',
        rating: 4.3,
        delivery_time: '25-35 min',
        delivery_fee: 4.0,
        image: 'https://via.placeholder.com/300x200?text=Taco+Loco',
      },
      {
        name: 'Sabor Caseiro',
        category: 'Brasileira',
        rating: 4.6,
        delivery_time: '35-45 min',
        delivery_fee: 6.0,
        image: 'https://via.placeholder.com/300x200?text=Sabor+Caseiro',
      },
    ];

    const restaurantIds: number[] = [];

    for (const restaurant of restaurants) {
      const result = await queryRunner.query(
        `INSERT INTO restaurants (name, category, rating, delivery_time, delivery_fee, image, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
         ON CONFLICT (name) DO UPDATE SET 
           category = EXCLUDED.category,
           rating = EXCLUDED.rating,
           delivery_time = EXCLUDED.delivery_time,
           delivery_fee = EXCLUDED.delivery_fee,
           image = EXCLUDED.image
         RETURNING id`,
        [
          restaurant.name,
          restaurant.category,
          restaurant.rating,
          restaurant.delivery_time,
          restaurant.delivery_fee,
          restaurant.image,
          true,
        ],
      );
      restaurantIds.push(result[0].id);
    }
    console.log(`✅ ${restaurants.length} restaurantes criados/atualizados`);

    // Produtos para cada restaurante
    const products = [
      // Pizza Bella
      {
        restaurant_id: restaurantIds[0],
        name: 'Pizza Margherita',
        description: 'Molho de tomate, mussarela, manjericão fresco',
        price: 42.9,
        image: 'https://via.placeholder.com/200?text=Margherita',
      },
      {
        restaurant_id: restaurantIds[0],
        name: 'Pizza Calabresa',
        description: 'Molho de tomate, mussarela, calabresa, cebola',
        price: 45.9,
        image: 'https://via.placeholder.com/200?text=Calabresa',
      },
      {
        restaurant_id: restaurantIds[0],
        name: 'Pizza Quatro Queijos',
        description: 'Mussarela, gorgonzola, parmesão, catupiry',
        price: 48.9,
        image: 'https://via.placeholder.com/200?text=4+Queijos',
      },

      // Burger House
      {
        restaurant_id: restaurantIds[1],
        name: 'Classic Burger',
        description: 'Hambúrguer 150g, queijo, alface, tomate, maionese',
        price: 28.9,
        image: 'https://via.placeholder.com/200?text=Classic',
      },
      {
        restaurant_id: restaurantIds[1],
        name: 'Bacon Burger',
        description: 'Hambúrguer 150g, bacon, cheddar, cebola caramelizada',
        price: 32.9,
        image: 'https://via.placeholder.com/200?text=Bacon',
      },
      {
        restaurant_id: restaurantIds[1],
        name: 'Double Smash',
        description: '2 hambúrgueres smash 100g, queijo, molho especial',
        price: 35.9,
        image: 'https://via.placeholder.com/200?text=Double',
      },

      // Sushi Master
      {
        restaurant_id: restaurantIds[2],
        name: 'Combo Sushi 20 peças',
        description: 'Mix de sushis e sashimis variados',
        price: 65.9,
        image: 'https://via.placeholder.com/200?text=Combo+Sushi',
      },
      {
        restaurant_id: restaurantIds[2],
        name: 'Temaki Salmão',
        description: 'Temaki de salmão com cream cheese',
        price: 18.9,
        image: 'https://via.placeholder.com/200?text=Temaki',
      },
      {
        restaurant_id: restaurantIds[2],
        name: 'Hot Roll Filadélfia',
        description: '8 peças empanadas com salmão e cream cheese',
        price: 32.9,
        image: 'https://via.placeholder.com/200?text=Hot+Roll',
      },

      // Taco Loco
      {
        restaurant_id: restaurantIds[3],
        name: 'Taco Carne',
        description: '3 tacos com carne moída temperada, queijo, salsa',
        price: 24.9,
        image: 'https://via.placeholder.com/200?text=Taco+Carne',
      },
      {
        restaurant_id: restaurantIds[3],
        name: 'Burrito Completo',
        description: 'Burrito grande com carne, arroz, feijão, queijo',
        price: 28.9,
        image: 'https://via.placeholder.com/200?text=Burrito',
      },
      {
        restaurant_id: restaurantIds[3],
        name: 'Nachos Supreme',
        description: 'Nachos com queijo derretido, guacamole, jalapeños',
        price: 22.9,
        image: 'https://via.placeholder.com/200?text=Nachos',
      },

      // Sabor Caseiro
      {
        restaurant_id: restaurantIds[4],
        name: 'Feijoada Completa',
        description: 'Feijoada com arroz, farofa, couve, laranja',
        price: 38.9,
        image: 'https://via.placeholder.com/200?text=Feijoada',
      },
      {
        restaurant_id: restaurantIds[4],
        name: 'Bife à Parmegiana',
        description: 'Bife empanado com molho e queijo, arroz e fritas',
        price: 42.9,
        image: 'https://via.placeholder.com/200?text=Parmegiana',
      },
      {
        restaurant_id: restaurantIds[4],
        name: 'Marmita Executiva',
        description: 'Arroz, feijão, bife acebolado, salada, batata',
        price: 25.9,
        image: 'https://via.placeholder.com/200?text=Marmita',
      },
    ];

    for (const product of products) {
      await queryRunner.query(
        `INSERT INTO products (restaurant_id, name, description, price, image, is_available, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
         ON CONFLICT DO NOTHING`,
        [
          product.restaurant_id,
          product.name,
          product.description,
          product.price,
          product.image,
          true,
        ],
      );
    }
    console.log(`✅ ${products.length} produtos criados`);

    await queryRunner.commitTransaction();
    console.log('✅ Seed concluído com sucesso!');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('❌ Erro ao executar seed:', error);
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

seed().catch(console.error);
