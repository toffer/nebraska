-- +migrate Up

-- only add data if an application does not exist yet.

-- +migrate StatementBegin

DO LANGUAGE plpgsql $$
begin
    if not exists (select id from application limit 1) then
        insert into application (id, name, description, team_id) values ('e96281a6-d1af-4bde-9a0a-97b76e56dc57', 'Flatcar Container Linux', 'Linux for massive server deployments', 'd89342dc-9214-441d-a4af-bdd837a3b239');

        -- stable channel update
        insert into package values ('84b4c599-9b6b-44a8-b13c-d4263fff0403', 1, '2191.5.0', 'https://update.release.flatcar-linux.net/amd64-usr/2191.5.0/', 'flatcar_production_update.gz', 'Flatcar Container Linux 2191.5.0', '465881871', 'r3nufcxgMTZaxYEqL+x2zIoeClk=', '2019-09-05 10:41:09.265687+00', 'e96281a6-d1af-4bde-9a0a-97b76e56dc57');
        -- beta channel update
        insert into package values ('cbc1ca68-f739-43de-91bc-542aec9eeac5', 1, '2247.2.0', 'https://update.release.flatcar-linux.net/amd64-usr/2247.2.0/', 'flatcar_production_update.gz', 'Flatcar Container Linux 2247.2.0', '467048659', 'Oa9u83Dxc+kbZnu6wEaxzocVvJo=', '2019-09-13 13:39:32.794613+00', 'e96281a6-d1af-4bde-9a0a-97b76e56dc57');
        -- alpha channel update
        insert into package values ('0c2635c7-4ef8-4e4b-b768-6292508f9700', 1, '2261.0.0', 'https://update.release.flatcar-linux.net/amd64-usr/2261.0.0/', 'flatcar_production_update.gz', 'Flatcar Container Linux 2261.0.0', '467500954', 'GTNbHomjMXq/x2OU3B9vMtaBYXw=', '2019-09-13 13:52:45.275675+00', 'e96281a6-d1af-4bde-9a0a-97b76e56dc57');
        -- edge channel update
        insert into package values ('b6cd0aa9-6d5c-4818-ae0e-10c07aca4c3a', 1, '2247.99.0', 'https://update.release.flatcar-linux.net/amd64-usr/2247.99.0/', 'flatcar_production_update.gz', 'Flatcar Container Linux 2247.99.0', '486809098', 'tGBe5k1+n/9Xw2oRdw58JNUrzEk=', '2019-09-05 11:25:35.210186+00', 'e96281a6-d1af-4bde-9a0a-97b76e56dc57');

        insert into channel values ('e06064ad-4414-4904-9a6e-fd465593d1b2', 'stable', '#14b9d6', '2015-09-19 05:09:34.261241', 'e96281a6-d1af-4bde-9a0a-97b76e56dc57', '84b4c599-9b6b-44a8-b13c-d4263fff0403');
        insert into channel values ('128b8c29-5058-4643-8e67-a1a0e3c641c9', 'beta', '#fc7f33', '2015-09-19 05:09:34.264334', 'e96281a6-d1af-4bde-9a0a-97b76e56dc57', 'cbc1ca68-f739-43de-91bc-542aec9eeac5');
        insert into channel values ('a87a03ad-4984-47a1-8dc4-3507bae91ee1', 'alpha', '#1fbb86', '2015-09-19 05:09:34.265754', 'e96281a6-d1af-4bde-9a0a-97b76e56dc57', '0c2635c7-4ef8-4e4b-b768-6292508f9700');
        insert into channel values ('72834a2b-ad86-4d6d-b498-e08a19ebe54e', 'edge', '#f44e3b', '2015-09-19 05:09:34.265754', 'e96281a6-d1af-4bde-9a0a-97b76e56dc57', 'b6cd0aa9-6d5c-4818-ae0e-10c07aca4c3a');

        insert into groups values ('9a2deb70-37be-4026-853f-bfdd6b347bbe', 'Stable', 'For production clusters', false, true, true, false, 'Europe/Berlin', '15 minutes', 2, '60 minutes', '2015-09-19 05:09:34.269062', 'e96281a6-d1af-4bde-9a0a-97b76e56dc57', 'e06064ad-4414-4904-9a6e-fd465593d1b2');
        insert into groups values ('3fe10490-dd73-4b49-b72a-28ac19acfcdc', 'Beta', 'Promoted alpha releases, to catch bugs specific to your configuration', false, true, true, false, 'Europe/Berlin', '15 minutes', 2, '60 minutes', '2015-09-19 05:09:34.273244', 'e96281a6-d1af-4bde-9a0a-97b76e56dc57', '128b8c29-5058-4643-8e67-a1a0e3c641c9');
        insert into groups values ('5b810680-e36a-4879-b98a-4f989e80b899', 'Alpha', 'Tracks current development work and is released frequently', false, true, true, false, 'Europe/Berlin', '15 minutes', 1, '30 minutes', '2015-09-19 05:09:34.274911', 'e96281a6-d1af-4bde-9a0a-97b76e56dc57', 'a87a03ad-4984-47a1-8dc4-3507bae91ee1');
        insert into groups values ('72834a2b-ad86-4d6d-b498-e08a19ebe54e', 'Edge', 'Experimental features and patches', false, true, true, false, 'Europe/Berlin', '15 minutes', 1, '30 minutes', '2018-04-10 10:25:39.677359+00', 'e96281a6-d1af-4bde-9a0a-97b76e56dc57', '72834a2b-ad86-4d6d-b498-e08a19ebe54e');
    end if;
end;
$$;

-- +migrate StatementEnd

-- +migrate Down
