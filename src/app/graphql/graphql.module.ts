import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';

@NgModule({
  imports: [
    HttpClientModule,
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink): ApolloClientOptions<any> => {
        return {
          link: httpLink.create({ uri: 'https://localhost:7044/graphql' }), // Replace the URI with your GraphQL endpoint
          cache: new InMemoryCache(),
        };
      },
      deps: [HttpLink],
    },
  ],
 
})
export class GraphqlModule {}
